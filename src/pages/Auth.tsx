import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileSetupDialog from '@/components/ProfileSetupDialog';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [currentTab, setCurrentTab] = useState('login');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  // 사용자가 로그인되어 있고 프로필이 로드되었을 때 체크
  useEffect(() => {
    if (user && !profileLoading && profile) {
      // 대학교나 학과 정보가 없으면 프로필 설정 다이얼로그 표시
      if (!profile.university || !profile.major) {
        setShowProfileSetup(true);
      } else {
        // 프로필이 완성되어 있으면 메인 페이지로 이동
        navigate('/');
      }
    }
  }, [user, profile, profileLoading, navigate]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      toast({
        title: "구글 로그인 오류",
        description: error.message,
        variant: "destructive",
      });
    }
    setGoogleLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "오류",
        description: "이메일을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth?tab=reset-password`,
    });

    if (error) {
      toast({
        title: "비밀번호 재설정 오류",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "이메일을 확인해주세요",
        description: "비밀번호 재설정 링크를 이메일로 보내드렸습니다.",
      });
      setCurrentTab('login');
    }
    setResetLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast({
        title: "오류",
        description: "이메일, 비밀번호, 이름을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      toast({
        title: "회원가입 오류",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "회원가입 성공!",
        description: "프로필 설정을 완료해주세요.",
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "오류",
        description: "이메일과 비밀번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "로그인 오류",
        description: error.message === 'Invalid login credentials' ? 
          '이메일 또는 비밀번호가 올바르지 않습니다.' : error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleProfileSetupClose = () => {
    setShowProfileSetup(false);
    navigate('/');
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">JobTracker</CardTitle>
            <p className="text-gray-600">취업 지원 현황을 효율적으로 관리하세요</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <Button 
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium border border-gray-300"
              >
                {googleLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                구글로 로그인
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-50 px-2 text-muted-foreground">또는</span>
                </div>
              </div>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">로그인</TabsTrigger>
                <TabsTrigger value="signup">회원가입</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      이메일
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      비밀번호
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    로그인
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('reset')}
                      className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      비밀번호를 잊으셨나요?
                    </button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      이름 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="홍길동"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      이메일
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      비밀번호
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요 (최소 6자)"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    회원가입
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">비밀번호 재설정</h3>
                    <p className="text-sm text-gray-600">
                      등록하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                    </p>
                  </div>
                  
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        이메일
                      </Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={resetLoading}>
                      {resetLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      재설정 링크 보내기
                    </Button>
                  </form>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('login')}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      로그인으로 돌아가기
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ProfileSetupDialog 
        open={showProfileSetup} 
        onClose={handleProfileSetupClose}
      />
    </>
  );
};

export default Auth;
