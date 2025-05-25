
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  emailNotifications: boolean;
  interviewReminders: boolean;
  applicationDeadlines: boolean;
  soundEnabled: boolean;
}

interface UserPreferences {
  language: string;
  theme: string;
  autoSave: boolean;
  compactView: boolean;
}

interface UserSettings {
  notifications: NotificationSettings;
  preferences: UserPreferences;
}

const defaultSettings: UserSettings = {
  notifications: {
    emailNotifications: true,
    interviewReminders: true,
    applicationDeadlines: true,
    soundEnabled: true
  },
  preferences: {
    language: "ko",
    theme: "system",
    autoSave: true,
    compactView: false
  }
};

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // 설정 로드
  const loadSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('notifications, preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('설정 로드 오류:', error);
        // 에러가 발생해도 기본 설정으로 진행
        setSettings(defaultSettings);
      } else if (data) {
        setSettings({
          notifications: data.notifications as NotificationSettings,
          preferences: data.preferences as UserPreferences
        });
      } else {
        // 설정이 없으면 기본 설정으로 새로 생성
        await createInitialSettings();
      }
    } catch (error) {
      console.error('설정 로드 중 예외 발생:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  // 초기 설정 생성
  const createInitialSettings = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          notifications: defaultSettings.notifications,
          preferences: defaultSettings.preferences
        });

      if (error) {
        console.error('초기 설정 생성 오류:', error);
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('초기 설정 생성 중 예외 발생:', error);
    }
  };

  // 알림 설정 업데이트
  const updateNotifications = async (notifications: NotificationSettings) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications: notifications,
          preferences: settings.preferences
        });

      if (error) {
        console.error('알림 설정 업데이트 오류:', error);
        toast({
          title: "오류 발생",
          description: "알림 설정 저장에 실패했습니다.",
          variant: "destructive",
        });
        return false;
      }

      setSettings(prev => ({ ...prev, notifications }));
      return true;
    } catch (error) {
      console.error('알림 설정 업데이트 중 예외 발생:', error);
      toast({
        title: "오류 발생",
        description: "알림 설정 저장에 실패했습니다.",
        variant: "destructive",
      });
      return false;
    }
  };

  // 환경설정 업데이트
  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications: settings.notifications,
          preferences: preferences
        });

      if (error) {
        console.error('환경설정 업데이트 오류:', error);
        toast({
          title: "오류 발생",
          description: "환경설정 저장에 실패했습니다.",
          variant: "destructive",
        });
        return false;
      }

      setSettings(prev => ({ ...prev, preferences }));
      return true;
    } catch (error) {
      console.error('환경설정 업데이트 중 예외 발생:', error);
      toast({
        title: "오류 발생",
        description: "환경설정 저장에 실패했습니다.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  return {
    settings,
    loading,
    updateNotifications,
    updatePreferences,
    loadSettings
  };
};
