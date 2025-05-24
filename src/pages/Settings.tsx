
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "사용자",
    email: "user@example.com",
    phone: "",
    bio: ""
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    interviewReminders: true,
    applicationDeadlines: true
  });

  const handleProfileSave = () => {
    toast({
      title: "프로필 저장됨",
      description: "프로필 정보가 성공적으로 저장되었습니다.",
    });
  };

  const handleNotificationsSave = () => {
    toast({
      title: "알림 설정 저장됨",
      description: "알림 설정이 성공적으로 저장되었습니다.",
    });
  };

  const handleDataExport = () => {
    toast({
      title: "데이터 내보내기",
      description: "데이터 내보내기가 시작되었습니다.",
    });
  };

  const handleDataClear = () => {
    toast({
      title: "데이터 삭제",
      description: "모든 데이터가 삭제되었습니다.",
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
              <CardTitle>프로필 정보</CardTitle>
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
              <CardTitle>알림 설정</CardTitle>
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
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailNotifications: checked})
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>푸시 알림</Label>
                  <p className="text-sm text-gray-500">브라우저 푸시 알림을 받습니다</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, pushNotifications: checked})
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
              <Button onClick={handleNotificationsSave}>알림 설정 저장</Button>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card>
            <CardHeader>
              <CardTitle>데이터 관리</CardTitle>
              <CardDescription>
                데이터를 백업하거나 초기화하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDataExport} variant="outline">
                  데이터 내보내기
                </Button>
                <Button 
                  onClick={handleDataClear} 
                  variant="destructive"
                  className="sm:ml-auto"
                >
                  모든 데이터 삭제
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                데이터 내보내기: 모든 지원 현황을 JSON 파일로 다운로드합니다.<br/>
                모든 데이터 삭제: 저장된 모든 정보가 영구적으로 삭제됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
