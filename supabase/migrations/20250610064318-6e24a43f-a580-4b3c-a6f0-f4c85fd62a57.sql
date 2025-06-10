
-- Drop all existing policies safely
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can create their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own cover letter sections" ON public.cover_letter_sections;
DROP POLICY IF EXISTS "Users can create cover letter sections for their companies" ON public.cover_letter_sections;
DROP POLICY IF EXISTS "Users can update their own cover letter sections" ON public.cover_letter_sections;
DROP POLICY IF EXISTS "Users can delete their own cover letter sections" ON public.cover_letter_sections;

-- Now safely create all RLS policies

-- RLS policies for user_settings table
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for cover_letter_sections table
CREATE POLICY "Users can view their own cover letter sections" 
  ON public.cover_letter_sections 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = cover_letter_sections.company_id 
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Users can create cover letter sections for their companies" 
  ON public.cover_letter_sections 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = cover_letter_sections.company_id 
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own cover letter sections" 
  ON public.cover_letter_sections 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = cover_letter_sections.company_id 
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own cover letter sections" 
  ON public.cover_letter_sections 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = cover_letter_sections.company_id 
    AND companies.user_id = auth.uid()
  ));

-- Enable RLS on cover_letter_sections table
ALTER TABLE public.cover_letter_sections ENABLE ROW LEVEL SECURITY;

-- Add constraints safely (will skip if they already exist)
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.companies 
    ADD CONSTRAINT valid_application_link 
    CHECK (
      application_link IS NULL OR 
      application_link ~* '^https?://[^\s/$.?#].[^\s]*$'
    );
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.companies 
    ADD CONSTRAINT company_name_length CHECK (char_length(name) <= 200);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.companies 
    ADD CONSTRAINT position_length CHECK (char_length(position) <= 200);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.companies 
    ADD CONSTRAINT description_length CHECK (char_length(description) <= 2000);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.cover_letter_sections 
    ADD CONSTRAINT title_length CHECK (char_length(title) <= 200);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.cover_letter_sections 
    ADD CONSTRAINT content_length CHECK (char_length(content) <= 10000);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.notifications 
    ADD CONSTRAINT notifications_title_length CHECK (char_length(title) <= 200);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.notifications 
    ADD CONSTRAINT notifications_message_length CHECK (char_length(message) <= 2000);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Create audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Drop and recreate audit log policy
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_log;
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_log 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create or replace the audit logging function
CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log sensitive operations
  INSERT INTO public.audit_log (
    user_id, 
    table_name, 
    operation, 
    timestamp
  ) VALUES (
    auth.uid(), 
    TG_TABLE_NAME, 
    TG_OP, 
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers safely
DROP TRIGGER IF EXISTS audit_companies ON public.companies;
CREATE TRIGGER audit_companies 
  AFTER INSERT OR UPDATE OR DELETE ON public.companies 
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_operation();

DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;
CREATE TRIGGER audit_user_roles 
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles 
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_operation();
