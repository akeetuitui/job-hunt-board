
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'user';

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 현재 사용자의 역할 조회
  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }

      return data as UserRoleData[];
    },
    enabled: !!user,
  });

  // 사용자가 관리자인지 확인
  const isAdmin = userRoles.some(role => role.role === 'admin');

  // 역할 추가 mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast({
        title: "역할 추가 완료",
        description: "사용자 역할이 성공적으로 추가되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error adding role:', error);
      toast({
        title: "오류",
        description: "역할 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    userRoles,
    isAdmin,
    isLoading,
    addRole: addRoleMutation.mutate,
    isAddingRole: addRoleMutation.isPending,
  };
};
