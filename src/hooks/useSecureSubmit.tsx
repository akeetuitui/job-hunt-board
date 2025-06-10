
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRateLimiter } from '@/utils/security';

interface UseSecureSubmitOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  rateLimitKey?: string;
}

export const useSecureSubmit = (options: UseSecureSubmitOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const secureSubmit = async (
    submitFn: () => Promise<void>,
    validationFn?: () => { isValid: boolean; error?: string }
  ) => {
    // Rate limiting check
    const rateLimitKey = options.rateLimitKey || 'default';
    if (!apiRateLimiter.canMakeRequest(rateLimitKey)) {
      toast({
        title: "요청 제한",
        description: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
      return;
    }

    // Input validation
    if (validationFn) {
      const validation = validationFn();
      if (!validation.isValid) {
        toast({
          title: "입력 오류",
          description: validation.error || "올바르지 않은 입력입니다.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      await submitFn();
      options.onSuccess?.();
    } catch (error) {
      console.error('Secure submit error:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      });
      
      options.onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    secureSubmit,
    isSubmitting
  };
};
