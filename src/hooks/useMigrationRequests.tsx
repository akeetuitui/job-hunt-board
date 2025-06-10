
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface MigrationRequest {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  notes?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

export const useMigrationRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 마이그레이션 요청 조회 (관리자는 모든 요청, 일반 사용자는 본인 요청만)
  const { data: migrationRequests = [], isLoading } = useQuery({
    queryKey: ['migration-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('migration_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching migration requests:', error);
        throw error;
      }

      return data as MigrationRequest[];
    },
    enabled: !!user,
  });

  // 마이그레이션 요청 생성
  const createRequestMutation = useMutation({
    mutationFn: async ({ fileName, filePath, fileType }: { 
      fileName: string; 
      filePath: string; 
      fileType: string; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('migration_requests')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_path: filePath,
          file_type: fileType,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['migration-requests'] });
      toast({
        title: "업로드 완료",
        description: "마이그레이션 요청이 성공적으로 제출되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error creating migration request:', error);
      toast({
        title: "오류",
        description: "마이그레이션 요청 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // 마이그레이션 요청 상태 업데이트 (관리자용)
  const updateRequestMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: { 
      id: string; 
      status: MigrationRequest['status']; 
      notes?: string; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('migration_requests')
        .update({
          status,
          notes,
          processed_by: user.id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['migration-requests'] });
      toast({
        title: "업데이트 완료",
        description: "마이그레이션 요청이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error updating migration request:', error);
      toast({
        title: "오류",
        description: "마이그레이션 요청 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    migrationRequests,
    isLoading,
    createRequest: createRequestMutation.mutate,
    updateRequest: updateRequestMutation.mutate,
    isCreatingRequest: createRequestMutation.isPending,
    isUpdatingRequest: updateRequestMutation.isPending,
  };
};
