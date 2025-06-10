
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  type: 'suspicious_activity' | 'multiple_failed_attempts' | 'unusual_pattern';
  details: string;
  timestamp: string;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Monitor for suspicious activities
    const monitorSecurity = () => {
      // Check for unusual navigation patterns
      let navigationCount = 0;
      const navigationLimit = 50; // Max navigations per session
      
      const handleNavigation = () => {
        navigationCount++;
        if (navigationCount > navigationLimit) {
          logSecurityEvent({
            type: 'unusual_pattern',
            details: 'Excessive navigation detected',
            timestamp: new Date().toISOString()
          });
        }
      };

      // Monitor console access (potential developer tools usage)
      const originalLog = console.log;
      console.log = (...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('password'))) {
          logSecurityEvent({
            type: 'suspicious_activity',
            details: 'Console logging detected with sensitive keywords',
            timestamp: new Date().toISOString()
          });
        }
        originalLog.apply(console, args);
      };

      window.addEventListener('beforeunload', handleNavigation);
      
      return () => {
        window.removeEventListener('beforeunload', handleNavigation);
        console.log = originalLog;
      };
    };

    const cleanup = monitorSecurity();
    return cleanup;
  }, [user]);

  const logSecurityEvent = (event: SecurityEvent) => {
    console.warn('Security event detected:', event);
    
    // In a real application, you would send this to your security monitoring service
    // For now, we'll just log it and optionally show a warning to the user
    if (event.type === 'suspicious_activity') {
      toast({
        title: "보안 알림",
        description: "비정상적인 활동이 감지되었습니다. 계정 보안을 확인해주세요.",
        variant: "destructive",
      });
    }
  };

  return { logSecurityEvent };
};
