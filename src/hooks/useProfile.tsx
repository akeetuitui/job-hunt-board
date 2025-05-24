
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  university: string | null;
  major: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('프로필 조회 오류:', error);
        toast({
          title: "프로필 조회 실패",
          description: "프로필 정보를 불러올 수 없습니다.",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('프로필 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('프로필 업데이트 오류:', error);
        toast({
          title: "프로필 업데이트 실패",
          description: "프로필 정보를 저장할 수 없습니다.",
          variant: "destructive",
        });
        return false;
      } else {
        setProfile({ ...profile, ...updates });
        toast({
          title: "프로필 저장됨",
          description: "프로필 정보가 성공적으로 저장되었습니다.",
        });
        return true;
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류:', error);
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
};
