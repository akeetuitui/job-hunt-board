
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface NotificationSettings {
  emailNotifications: boolean;
  interviewReminders: boolean;
  applicationDeadlines: boolean;
  soundEnabled: boolean;
}

export interface UserPreferences {
  language: string;
  theme: string;
  autoSave: boolean;
  compactView: boolean;
}

export interface UserSettings {
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
        setSettings(defaultSettings);
      } else if (data) {
        // 타입 안전한 변환
        const notifications: NotificationSettings = {
          emailNotifications: data.notifications?.emailNotifications ?? defaultSettings.notifications.emailNotifications,
          interviewReminders: data.notifications?.interviewReminders ?? defaultSettings.notifications.interviewReminders,
          applicationDeadlines: data.notifications?.applicationDeadlines ?? defaultSettings.notifications.applicationDeadlines,
          soundEnabled: data.notifications?.soundEnabled ?? defaultSettings.notifications.soundEnabled
        };
        
        const preferences: UserPreferences = {
          language: data.preferences?.language ?? defaultSettings.preferences.language,
          theme: data.preferences?.theme ?? defaultSettings.preferences.theme,
          autoSave: data.preferences?.autoSave ?? defaultSettings.preferences.autoSave,
          compactView: data.preferences?.compactView ?? defaultSettings.preferences.compactView
        };
        
        setSettings({ notifications, preferences });
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

      if (error && error.code !== '23505') { // 중복 키 오류가 아닌 경우만 로그
        console.error('초기 설정 생성 오류:', error);
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('초기 설정 생성 중 예외 발생:', error);
    }
  };

  // 알림 설정 업데이트
  const updateNotifications = async (notifications: NotificationSettings): Promise<boolean> => {
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
  const updatePreferences = async (preferences: UserPreferences): Promise<boolean> => {
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
