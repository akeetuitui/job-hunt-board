
-- 관리자 역할을 위한 enum 생성
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 사용자 역할 테이블
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 마이그레이션 요청 테이블 (사용자가 업로드한 파일들)
CREATE TABLE public.migration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 역할 확인 함수 (보안상 SECURITY DEFINER 사용)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS 정책 설정
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_requests ENABLE ROW LEVEL SECURITY;

-- user_roles 정책
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- migration_requests 정책
CREATE POLICY "Users can view their own migration requests" 
  ON public.migration_requests 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own migration requests" 
  ON public.migration_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all migration requests" 
  ON public.migration_requests 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_migration_requests_updated_at 
  BEFORE UPDATE ON public.migration_requests 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 파일 저장을 위한 storage 버킷 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('migration-files', 'migration-files', false);

-- storage 정책 설정
CREATE POLICY "Users can upload migration files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'migration-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all migration files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'migration-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own migration files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'migration-files' AND auth.uid()::text = (storage.foldername(name))[1]);
