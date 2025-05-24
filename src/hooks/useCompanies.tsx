
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/pages/Index';

export const useCompanies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch companies from Supabase
  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      return data?.map(company => ({
        id: company.id,
        name: company.name,
        position: company.position,
        positionType: company.position_type as Company['positionType'],
        status: company.status as Company['status'],
        deadline: company.deadline || undefined,
        description: company.description || undefined,
        applicationLink: company.application_link || undefined,
        coverLetter: company.cover_letter || undefined,
        createdAt: company.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      })) || [];
    },
    enabled: !!user,
  });

  // Add company mutation
  const addCompanyMutation = useMutation({
    mutationFn: async (newCompany: Omit<Company, "id" | "createdAt">) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          name: newCompany.name,
          position: newCompany.position,
          position_type: newCompany.positionType || null,
          status: newCompany.status,
          deadline: newCompany.deadline || null,
          description: newCompany.description || null,
          application_link: newCompany.applicationLink || null,
          cover_letter: newCompany.coverLetter || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "기업 추가 완료",
        description: "새로운 기업이 성공적으로 추가되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error adding company:', error);
      toast({
        title: "오류",
        description: "기업 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async (updatedCompany: Company) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: updatedCompany.name,
          position: updatedCompany.position,
          position_type: updatedCompany.positionType || null,
          status: updatedCompany.status,
          deadline: updatedCompany.deadline || null,
          description: updatedCompany.description || null,
          application_link: updatedCompany.applicationLink || null,
          cover_letter: updatedCompany.coverLetter || null,
        })
        .eq('id', updatedCompany.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "업데이트 완료",
        description: "기업 정보가 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error updating company:', error);
      toast({
        title: "오류",
        description: "기업 정보 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "삭제 완료",
        description: "기업이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error deleting company:', error);
      toast({
        title: "오류",
        description: "기업 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    companies,
    isLoading,
    error,
    addCompany: addCompanyMutation.mutate,
    updateCompany: updateCompanyMutation.mutate,
    deleteCompany: deleteCompanyMutation.mutate,
    isAddingCompany: addCompanyMutation.isPending,
    isUpdatingCompany: updateCompanyMutation.isPending,
    isDeletingCompany: deleteCompanyMutation.isPending,
  };
};
