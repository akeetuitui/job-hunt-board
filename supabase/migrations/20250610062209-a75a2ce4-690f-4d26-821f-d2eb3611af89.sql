
-- 알림 테이블 생성
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, success, error
  target_audience TEXT DEFAULT 'all', -- all, new_users, active_users, etc
  is_global BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- 사용자별 알림 읽음 상태 테이블
CREATE TABLE public.user_notification_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

-- RLS 정책 설정
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_status ENABLE ROW LEVEL SECURITY;

-- 알림 정책: 활성화된 알림만 볼 수 있음
CREATE POLICY "Users can view active notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- 관리자는 모든 알림 관리 가능
CREATE POLICY "Admins can manage all notifications" 
  ON public.notifications 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- 사용자는 본인의 알림 상태만 관리 가능
CREATE POLICY "Users can manage their own notification status" 
  ON public.user_notification_status 
  FOR ALL 
  USING (auth.uid() = user_id);

-- 관리자는 모든 알림 상태 조회 가능
CREATE POLICY "Admins can view all notification statuses" 
  ON public.user_notification_status 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));
