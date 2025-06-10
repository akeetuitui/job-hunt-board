import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell, Download, UserX, Shield, Upload, Database } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useSettings, type NotificationSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Settings = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { settings, loading: settingsLoading, updateNotifications } = useSettings();
  const { companies } = useCompanies();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
    university: "",
    major: ""
  });

  // 로그인하지 않은 사용자 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        email: profile.email || "",
        university: profile.university || "",
        major: profile.major || ""
      });
    }
  }, [profile]);

  const handleProfileSave = async () => {
    const success = await updateProfile({
      full_name: profileForm.full_name,
      university: profileForm.university,
      major: profileForm.major
    });

    if (success) {
      toast({
        title: "프로필 저장됨",
        description: "프로필 정보가 성공적으로 저장되었습니다.",
      });
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    if (!settings?.notifications) return;
    
    const updatedNotifications: NotificationSettings = { 
      ...settings.notifications, 
      [key]: value 
    };
    updateNotifications(updatedNotifications);
  };

  const handleDataExport = () => {
    const data = {
      profile: profileForm,
      settings: settings,
      companies: companies,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `jobtracker-data-${new Date().toLocaleDateString('ko-KR')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "데이터 내보내기 완료",
      description: "모든 데이터가 JSON 파일로 다운로드되었습니다.",
    });
  };

  const handleAccountDeletion = async () => {
    const confirmMessage = `정말로 계정을 탈퇴하시겠습니까?

이 작업을 수행하면:
• 모든 지원 회사 정보가 삭제됩니다
• 프로필 정보가 삭제됩니다  
• 설정이 삭제됩니다
• 이 작업은 되돌릴 수 없습니다

계속하려면 "계정삭제"를 정확히 입력해주세요.`;

    const userInput = prompt(confirmMessage);
    
    if (userInput !== "계정삭제") {
      if (userInput !== null) { // 사용자가 취소하지 않았다면
        toast({
          title: "탈퇴 취소됨",
          description: "정확한 확인 문구를 입력하지 않아 탈퇴가 취소되었습니다.",
        });
      }
      return;
    }

    if (!user) return;

    try {
      // Supabase에서 사용자 데이터 삭제 - RPC 함수가 없을 경우 직접 삭제
      // 먼저 관련 데이터들을 삭제
      await supabase.from('companies').delete().eq('user_id', user.id);
      await supabase.from('user_settings').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // 계정 삭제 후 로그아웃
      await supabase.auth.signOut();
      
      toast({
        title: "계정이 삭제되었습니다",
        description: "지금까지 JobTracker를 이용해주셔서 감사합니다.",
      });

      // 로그인 페이지로 리다이렉트
      navigate('/auth');
      
    } catch (error) {
      console.error('계정 삭제 중 예외 발생:', error);
      toast({
        title: "계정 삭제 실패",
        description: "계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || profileLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">설정</h1>
          <p className="text-gray-600">계정 정보와 앱 설정을 관리하세요</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* 프로필 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                프로필 정보
              </CardTitle>
              <CardDescription>
                개인 정보를 수정하고 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">이메일은 변경할 수 없습니다</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">대학교</Label>
                  <Input
                    id="university"
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({...profileForm, university: e.target.value})}
                    placeholder="예: 서울대학교"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">학과</Label>
                  <Input
                    id="major"
                    value={profileForm.major}
                    onChange={(e) => setProfileForm({...profileForm, major: e.target.value})}
                    placeholder="예: 컴퓨터공학과"
                  />
                </div>
              </div>
              <Button onClick={handleProfileSave}>프로필 저장</Button>
            </CardContent>
          </Card>

          {/* 데이터 마이그레이션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                데이터 마이그레이션
              </CardTitle>
              <CardDescription>
                기존에 관리하던 지원현황 데이터를 잡트래커로 이전하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200/50">
                <h4 className="font-medium text-indigo-900 mb-2">📊 지원현황 데이터 가져오기</h4>
                <p className="text-sm text-indigo-800 mb-4">
                  엑셀, 노션, PDF 등에서 관리하던 기존 지원현황을 업로드하면 관리자가 검토 후 잡트래커 데이터베이스로 이전해드립니다.
                </p>
                <ul className="text-sm text-indigo-700 mb-4 space-y-1">
                  <li>• 지원 가능한 형식: Excel(.xlsx, .xls), PDF(.pdf), CSV(.csv)</li>
                  <li>• 관리자가 데이터를 검토하고 일관된 형식으로 정리</li>
                  <li>• 처리 상태를 실시간으로 확인 가능</li>
                </ul>
                <Link to="/migration">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    마이그레이션 페이지로 이동
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                알림 설정
              </CardTitle>
              <CardDescription>
                받고 싶은 알림을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>이메일 알림</Label>
                  <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                </div>
                <Switch
                  checked={settings?.notifications?.emailNotifications || false}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>면접 일정 리마인더</Label>
                  <p className="text-sm text-gray-500">면접 하루 전 알림을 받습니다</p>
                </div>
                <Switch
                  checked={settings?.notifications?.interviewReminders || false}
                  onCheckedChange={(checked) => handleNotificationChange('interviewReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>지원 마감일 알림</Label>
                  <p className="text-sm text-gray-500">지원 마감 3일 전 알림을 받습니다</p>
                </div>
                <Switch
                  checked={settings?.notifications?.applicationDeadlines || false}
                  onCheckedChange={(checked) => handleNotificationChange('applicationDeadlines', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>알림 사운드</Label>
                  <p className="text-sm text-gray-500">알림과 함께 사운드를 재생합니다</p>
                </div>
                <Switch
                  checked={settings?.notifications?.soundEnabled || false}
                  onCheckedChange={(checked) => handleNotificationChange('soundEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                데이터 관리
              </CardTitle>
              <CardDescription>
                데이터를 백업하거나 계정을 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDataExport} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  데이터 내보내기
                </Button>
                <Button 
                  onClick={handleAccountDeletion} 
                  variant="destructive"
                  className="sm:ml-auto flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  계정 탈퇴하기
                </Button>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">클라우드 저장소 사용</h4>
                <p className="text-sm text-blue-800">
                  • 모든 중요한 데이터는 클라우드에 안전하게 저장됩니다<br/>
                  • 여러 기기에서 동일한 정보에 접근할 수 있습니다<br/>
                  • 브라우저를 바꿔도 데이터가 유지됩니다<br/>
                  • 데이터 내보내기로 언제든 백업을 만들 수 있습니다
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">⚠️ 계정 탈퇴 시 주의사항</h4>
                <p className="text-sm text-red-800">
                  계정을 탈퇴하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다. 
                  탈퇴 전에 반드시 데이터를 내보내기해서 백업하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
