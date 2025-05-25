
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProfileSetupDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileSetupDialog = ({ open, onClose }: ProfileSetupDialogProps) => {
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useProfile();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!university.trim() || !major.trim()) {
      toast({
        title: "정보 입력 필요",
        description: "대학교와 학과를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const success = await updateProfile({
      university: university.trim(),
      major: major.trim(),
    });

    if (success) {
      toast({
        title: "프로필 설정 완료!",
        description: "대학교와 학과 정보가 저장되었습니다.",
      });
      onClose();
    }
    setLoading(false);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">프로필 설정</DialogTitle>
          <DialogDescription className="text-center">
            JobTracker를 더 잘 활용할 수 있도록 기본 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="university">대학교</Label>
            <Input
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="예: 서울대학교"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="major">학과</Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터공학과"
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1"
            >
              나중에 설정
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              완료
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupDialog;
