
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  validateCompanyName, 
  validatePosition, 
  validateDescription, 
  validateApplicationLink,
  sanitizeHtml 
} from '@/utils/security';
import type { Company } from '@/pages/Index';

export const useCompanies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch companies with security validation
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          cover_letter_sections (
            id,
            title,
            content,
            max_length,
            sort_order
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      // Transform database data to match Company interface
      return data?.map(company => ({
        id: company.id,
        name: sanitizeHtml(company.name || ''),
        position: sanitizeHtml(company.position || ''),
        positionType: company.position_type as Company['positionType'],
        status: company.status as Company['status'],
        deadline: company.deadline || undefined,
        description: company.description ? sanitizeHtml(company.description) : undefined,
        applicationLink: company.application_link || undefined,
        coverLetter: company.cover_letter || undefined,
        coverLetterSections: company.cover_letter_sections?.map(section => ({
          id: section.id,
          title: sanitizeHtml(section.title || ''),
          content: sanitizeHtml(section.content || ''),
          maxLength: section.max_length || undefined
        })) || [],
        createdAt: company.created_at
      })) as Company[] || [];
    },
    enabled: !!user,
  });

  // Secure company validation
  const validateCompanyData = (company: Omit<Company, "id" | "createdAt">) => {
    const nameValidation = validateCompanyName(company.name);
    if (!nameValidation.isValid) return nameValidation;

    const positionValidation = validatePosition(company.position);
    if (!positionValidation.isValid) return positionValidation;

    if (company.description) {
      const descValidation = validateDescription(company.description);
      if (!descValidation.isValid) return descValidation;
    }

    if (company.applicationLink) {
      const linkValidation = validateApplicationLink(company.applicationLink);
      if (!linkValidation.isValid) return linkValidation;
    }

    return { isValid: true };
  };

  // Add company with security validation
  const addCompanyMutation = useMutation({
    mutationFn: async (company: Omit<Company, "id" | "createdAt">) => {
      if (!user) throw new Error('User not authenticated');

      // Validate input data
      const validation = validateCompanyData(company);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Sanitize input data and transform to database format
      const sanitizedCompany = {
        name: sanitizeHtml(company.name),
        position: sanitizeHtml(company.position),
        position_type: company.positionType,
        status: company.status,
        deadline: company.deadline || null,
        description: company.description ? sanitizeHtml(company.description) : null,
        application_link: company.applicationLink || null,
        cover_letter: company.coverLetter || null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('companies')
        .insert(sanitizedCompany)
        .select()
        .single();

      if (error) {
        console.error('Error adding company:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "회사 추가됨",
        description: "새로운 회사가 성공적으로 추가되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Add company error:', error);
      toast({
        title: "오류",
        description: error.message || "회사 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Update company with security validation
  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Company> }) => {
      if (!user) throw new Error('User not authenticated');

      // Validate updated data
      if (updates.name || updates.position || updates.description || updates.applicationLink) {
        const tempCompany = {
          name: updates.name || '',
          position: updates.position || '',
          description: updates.description,
          applicationLink: updates.applicationLink,
          status: updates.status || 'pending'
        } as Omit<Company, "id" | "createdAt">;

        const validation = validateCompanyData(tempCompany);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
      }

      // Sanitize updates and transform to database format
      const sanitizedUpdates: any = {};
      if (updates.name) sanitizedUpdates.name = sanitizeHtml(updates.name);
      if (updates.position) sanitizedUpdates.position = sanitizeHtml(updates.position);
      if (updates.positionType) sanitizedUpdates.position_type = updates.positionType;
      if (updates.status) sanitizedUpdates.status = updates.status;
      if (updates.deadline !== undefined) sanitizedUpdates.deadline = updates.deadline;
      if (updates.description !== undefined) sanitizedUpdates.description = updates.description ? sanitizeHtml(updates.description) : null;
      if (updates.applicationLink !== undefined) sanitizedUpdates.application_link = updates.applicationLink;
      if (updates.coverLetter !== undefined) sanitizedUpdates.cover_letter = updates.coverLetter;

      const { data, error } = await supabase
        .from('companies')
        .update(sanitizedUpdates)
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own companies
        .select()
        .single();

      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "회사 정보 업데이트됨",
        description: "회사 정보가 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Update company error:', error);
      toast({
        title: "오류",
        description: error.message || "회사 정보 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete company
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own companies

      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "회사 삭제됨",
        description: "회사가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Delete company error:', error);
      toast({
        title: "오류",
        description: "회사 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    companies,
    isLoading,
    addCompany: addCompanyMutation.mutate,
    updateCompany: (id: string, updates: Partial<Company>) => updateCompanyMutation.mutate({ id, updates }),
    deleteCompany: deleteCompanyMutation.mutate,
    isAddingCompany: addCompanyMutation.isPending,
    isUpdatingCompany: updateCompanyMutation.isPending,
    isDeletingCompany: deleteCompanyMutation.isPending,
  };
};
