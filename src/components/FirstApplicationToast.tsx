
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCompanies } from "@/hooks/useCompanies";

export const FirstApplicationToast = () => {
  const { toast } = useToast();
  const { companies } = useCompanies();
  const [hasShownFirstToast, setHasShownFirstToast] = useState(false);

  useEffect(() => {
    const hasSeenFirstApplicationToast = localStorage.getItem('first-application-toast-shown');
    
    if (companies && companies.length === 1 && !hasSeenFirstApplicationToast && !hasShownFirstToast) {
      toast({
        title: "🚀 첫 지원현황 등록 완료",
        description: "취업 준비의 첫 걸음을 시작하셨네요! 계속 화이팅하세요!",
      });
      
      localStorage.setItem('first-application-toast-shown', 'true');
      setHasShownFirstToast(true);
    }
  }, [companies, toast, hasShownFirstToast]);

  return null;
};
