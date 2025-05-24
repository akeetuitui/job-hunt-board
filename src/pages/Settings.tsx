
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell, Download, Trash2, Globe, Palette, Shield } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "사용자",
    email: "user@example.com",
    phone: "",
    bio: ""
  });
  
  const [notifications, setNotifications] = useState({
    browserNotifications: false,
    emailNotifications: true,
    interviewReminders: true,
    applicationDeadlines: true,
    soundEnabled: true
  });

  const [preferences, setPreferences] = useState({
    language: "ko",
    theme: "system",
    autoSave: true,
    compactView: false
  });

  const [browserNotificationSupported, setBrowserNotificationSupported] = useState(false);

  useEffect(() => {
    // 브라우저 알림 지원 여부 확인
    setBrowserNotificationSupported('Notification' in window);
  }, []);

  const requestNotificationPermission = async () => {
    if (!browserNotificationSupported) {
      toast({
        title: "알림 지원 안됨",
        description: "현재 브라우저에서는 알림을 지원하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications({...notifications, browserNotifications: true});
        toast({
          title: "알림 권한 허용됨",
          description: "브라우저 알림이 활성화되었습니다.",
        });
        // 테스트 알림
        new Notification("JobTracker", {
          body: "알림이 성공적으로 설정되었습니다!",
          icon: "/favicon.ico"
        });
      } else {
        toast({
          title: "알림 권한 거부됨",
          description: "브라우저 설정에서 알림을 허용해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  const handleProfileSave = () => {
    // 로컬 스토리지에 저장
    localStorage.setItem('jobtracker-profile', JSON.stringify(profile));
    toast({
      title: "프로필 저장됨",
      description: "프로필 정보가 성공적으로 저장되었습니다.",
    });
  };

  const handleNotificationsSave = () => {
    localStorage.setItem('jobtracker-notifications', JSON.stringify(notifications));
    toast({
      title: "알림 설정 저장됨",
      description: "알림 설정이 성공적으로 저장되었습니다.",
    });
  };

  const handlePreferencesSave = () => {
    localStorage.setItem('jobtracker-preferences', JSON.stringify(preferences));
    toast({
      title: "환경설정 저장됨",
      description: "환경설정이 성공적으로 저장되었습니다.",
    });
  };

  const handleDataExport = () => {
    const data = {
      profile,
      notifications,
      preferences,
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
      description: "데이터가 JSON 파일로 다운로드되었습니다.",
    });
  };

  const handleDataClear = () => {
    localStorage.removeItem('jobtracker-profile');
    localStorage.removeItem('jobtracker-notifications');
    localStorage.removeItem('jobtracker-preferences');
    localStorage.removeItem('jobtracker-applications');
    
    toast({
      title: "데이터 삭제 완료",
      description: "모든 로컬 데이터가 삭제되었습니다.",
      variant: "destructive",
    });
  };

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
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">자기소개</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="간단한 자기소개를 작성해주세요"
                  rows={3}
                />
              </div>
              <Button onClick={handleProfileSave}>프로필 저장</Button>
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
                  <Label>브라우저 알림</Label>
                  <p className="text-sm text-gray-500">
                    {browserNotificationSupported 
                      ? "브라우저에서 직접 알림을 받습니다" 
                      : "현재 브라우저에서 지원되지 않습니다"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!notifications.browserNotifications && browserNotificationSupported && (
                    <Button size="sm" onClick={requestNotificationPermission}>
                      권한 요청
                    </Button>
                  )}
                  <Switch
                    checked={notifications.browserNotifications}
                    disabled={!browserNotificationSupported}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, browserNotifications: checked})
                    }
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>이메일 알림</Label>
                  <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailNotifications: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>면접 일정 리마인더</Label>
                  <p className="text-sm text-gray-500">면접 하루 전 알림을 받습니다</p>
                </div>
                <Switch
                  checked={notifications.interviewReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, interviewReminders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>지원 마감일 알림</Label>
                  <p className="text-sm text-gray-500">지원 마감 3일 전 알림을 받습니다</p>
                </div>
                <Switch
                  checked={notifications.applicationDeadlines}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, applicationDeadlines: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>알림 사운드</Label>
                  <p className="text-sm text-gray-500">알림과 함께 사운드를 재생합니다</p>
                </div>
                <Switch
                  checked={notifications.soundEnabled}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, soundEnabled: checked})
                  }
                />
              </div>
              
              <Button onClick={handleNotificationsSave}>알림 설정 저장</Button>
            </CardContent>
          </Card>

          {/* 환경 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                환경 설정
              </CardTitle>
              <CardDescription>
                앱 사용 환경을 설정하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">언어</Label>
                  <Select value={preferences.language} onValueChange={(value) => 
                    setPreferences({...preferences, language: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme">테마</Label>
                  <Select value={preferences.theme} onValueChange={(value) => 
                    setPreferences({...preferences, theme: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">라이트</SelectItem>
                      <SelectItem value="dark">다크</SelectItem>
                      <SelectItem value="system">시스템 설정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>자동 저장</Label>
                  <p className="text-sm text-gray-500">변경사항을 자동으로 저장합니다</p>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => 
                    setPreferences({...preferences, autoSave: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>컴팩트 보기</Label>
                  <p className="text-sm text-gray-500">더 많은 정보를 한 화면에 표시합니다</p>
                </div>
                <Switch
                  checked={preferences.compactView}
                  onCheckedChange={(checked) => 
                    setPreferences({...preferences, compactView: checked})
                  }
                />
              </div>
              
              <Button onClick={handlePreferencesSave}>환경설정 저장</Button>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                데이터 관리
              </CardTitle>
              <CardDescription>
                데이터를 백업하거나 초기화하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDataExport} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  데이터 내보내기
                </Button>
                <Button 
                  onClick={handleDataClear} 
                  variant="destructive"
                  className="sm:ml-auto flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  모든 데이터 삭제
                </Button>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">웹 브라우저 저장소 사용</h4>
                <p className="text-sm text-blue-800">
                  • 데이터는 브라우저의 로컬 스토리지에 저장됩니다<br/>
                  • 브라우저 데이터를 삭제하면 모든 정보가 사라집니다<br/>
                  • 정기적으로 데이터를 내보내서 백업하세요
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
