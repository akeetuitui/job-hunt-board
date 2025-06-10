
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useMigrationRequests, MigrationRequest } from '@/hooks/useMigrationRequests';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const MigrationRequestsList = () => {
  const { migrationRequests, isLoading } = useMigrationRequests();
  const { isAdmin } = useUserRoles();

  const getStatusBadge = (status: MigrationRequest['status']) => {
    const statusConfig = {
      pending: { 
        label: '대기중', 
        variant: 'secondary' as const, 
        icon: Clock,
        color: 'text-yellow-600'
      },
      processing: { 
        label: '처리중', 
        variant: 'default' as const, 
        icon: Loader2,
        color: 'text-blue-600'
      },
      completed: { 
        label: '완료', 
        variant: 'default' as const, 
        icon: CheckCircle,
        color: 'text-green-600'
      },
      failed: { 
        label: '실패', 
        variant: 'destructive' as const, 
        icon: XCircle,
        color: 'text-red-600'
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className={`w-3 h-3 ${config.color} ${status === 'processing' ? 'animate-spin' : ''}`} />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <FileText className="w-4 h-4 text-green-600" />;
    }
    if (fileType.includes('pdf')) {
      return <FileText className="w-4 h-4 text-red-600" />;
    }
    return <FileText className="w-4 h-4 text-gray-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">마이그레이션 요청을 불러오는 중...</span>
      </div>
    );
  }

  if (migrationRequests.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border border-white/30">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            마이그레이션 요청이 없습니다
          </h3>
          <p className="text-gray-600">
            기존 데이터를 이전하려면 파일을 업로드해주세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {migrationRequests.map((request) => (
        <Card key={request.id} className="bg-white/60 backdrop-blur-sm border border-white/30 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                {getFileTypeIcon(request.file_type)}
                <span>{request.file_name}</span>
              </CardTitle>
              {getStatusBadge(request.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">업로드 일시:</span>{' '}
                  {format(new Date(request.created_at), 'PPP p', { locale: ko })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">파일 타입:</span>{' '}
                  {request.file_type}
                </p>
              </div>
              
              {request.notes && (
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">관리자 메모:</span>
                  </p>
                  <p className="text-sm text-gray-800 mt-1 p-2 bg-white/50 rounded border">
                    {request.notes}
                  </p>
                </div>
              )}
            </div>
            
            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>다운로드</span>
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    처리하기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MigrationRequestsList;
