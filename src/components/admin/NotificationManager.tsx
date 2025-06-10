
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const NotificationManager = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    target_audience: 'all',
    expires_at: '',
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .insert({
          title: data.title,
          message: data.message,
          type: data.type,
          target_audience: data.target_audience,
          created_by: user.id,
          expires_at: data.expires_at || null,
          is_active: true,
          is_global: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setFormData({
        title: '',
        message: '',
        type: 'info',
        target_audience: 'all',
        expires_at: '',
      });
      toast({
        title: "알림 생성 완료",
        description: "새로운 알림이 성공적으로 생성되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error creating notification:', error);
      toast({
        title: "오류",
        description: "알림 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast({
        title: "필수 항목 누락",
        description: "제목과 내용을 모두 입력해 주세요.",
        variant: "destructive",
      });
      return;
    }
    createNotificationMutation.mutate(formData);
  };

  if (!isAdmin) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">관리자 권한이 필요합니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          알림 생성
        </CardTitle>
        <CardDescription>
          사용자들에게 공지사항을 전달할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="알림 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">내용</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="알림 내용을 입력하세요"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">알림 유형</Label>
            <Select value={formData.type} onValueChange={(value: typeof formData.type) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">정보</SelectItem>
                <SelectItem value="success">성공</SelectItem>
                <SelectItem value="warning">경고</SelectItem>
                <SelectItem value="error">오류</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expires_at">만료일 (선택사항)</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createNotificationMutation.isPending}
          >
            {createNotificationMutation.isPending ? '생성 중...' : '알림 생성'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationManager;
