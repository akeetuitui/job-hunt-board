
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target_audience: string;
  is_global: boolean;
  created_by: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  is_read?: boolean;
  read_at?: string | null;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 활성 알림 조회
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // 활성 알림과 사용자 읽음 상태를 함께 조회
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          user_notification_status!left (
            is_read,
            read_at
          )
        `)
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .eq('user_notification_status.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      return data.map(notification => ({
        ...notification,
        is_read: notification.user_notification_status?.[0]?.is_read || false,
        read_at: notification.user_notification_status?.[0]?.read_at || null,
      })) as Notification[];
    },
    enabled: !!user,
  });

  // 알림을 읽음으로 표시
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) return;

      const { error } = await supabase
        .from('user_notification_status')
        .upsert({
          user_id: user.id,
          notification_id: notificationId,
          is_read: true,
          read_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: "오류",
        description: "알림을 읽음으로 표시하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // 모든 알림을 읽음으로 표시
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      const promises = unreadNotifications.map(notification =>
        supabase
          .from('user_notification_status')
          .upsert({
            user_id: user.id,
            notification_id: notification.id,
            is_read: true,
            read_at: new Date().toISOString(),
          })
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "완료",
        description: "모든 알림을 읽음으로 처리했습니다.",
      });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "오류",
        description: "알림을 읽음으로 표시하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};
