
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMigrationRequests } from '@/hooks/useMigrationRequests';
import { useToast } from '@/hooks/use-toast';

const MigrationUploadDialog = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { createRequest } = useMigrationRequests();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // 파일 타입 검증
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/pdf',
        'text/csv'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "지원하지 않는 파일 형식",
          description: "엑셀(.xlsx, .xls), PDF(.pdf), CSV(.csv) 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleFileButtonClick = () => {
    // 숨겨진 파일 input을 직접 클릭
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // 파일을 Supabase Storage에 업로드
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('migration-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 마이그레이션 요청 생성
      createRequest({
        fileName: file.name,
        filePath: uploadData.path,
        fileType: file.type,
      });

      setFile(null);
      setOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
          <Upload className="w-4 h-4 mr-2" />
          데이터 마이그레이션 요청
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            데이터 마이그레이션 요청
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            기존에 관리하던 지원현황 파일을 업로드해주세요. 관리자가 검토 후 데이터를 이전해드립니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gradient-to-br from-slate-50 to-indigo-50/30">
            <div className="flex justify-center space-x-2 mb-3">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              엑셀(.xlsx, .xls), PDF(.pdf), CSV(.csv) 파일을 지원합니다
            </p>
            
            {/* 숨겨진 파일 input */}
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.pdf,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* 클릭 가능한 버튼 */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleFileButtonClick}
            >
              <Upload className="w-4 h-4 mr-2" />
              파일 선택
            </Button>
            
            {file && (
              <div className="mt-3 p-2 bg-white/80 rounded border">
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isUploading ? '업로드 중...' : '업로드'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MigrationUploadDialog;
