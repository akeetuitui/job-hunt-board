
-- skj6164@naver.com 사용자에게 관리자 권한 부여
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'skj6164@naver.com'
ON CONFLICT (user_id, role) DO NOTHING;
