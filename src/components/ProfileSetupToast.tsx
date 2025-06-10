
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export const ProfileSetupToast = () => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const { user } = useAuth();
  const [hasShownProfileToast, setHasShownProfileToast] = useState(false);

  useEffect(() => {
    const hasSeenProfileToast = localStorage.getItem('profile-setup-toast-shown');
    
    if (user && profile && (!profile.university || !profile.major) && 
        !hasSeenProfileToast && !hasShownProfileToast) {
      toast({
        title: "🎓 프로필 설정을 완료해주세요",
        description: "학교와 전공 정보를 입력하시면 더 맞춤형 서비스를 제공할 수 있습니다.",
      });
      
      localStorage.setItem('profile-setup-toast-shown', 'true');
      setHasShownProfileToast(true);
    }
  }, [user, profile, toast, hasShownProfileToast]);

  return null;
};
