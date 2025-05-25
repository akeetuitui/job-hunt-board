
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const demoCompanies = [
  {
    id: "1",
    name: "삼성전자",
    position: "소프트웨어 엔지니어",
    status: "pending" as const,
    deadline: "2025-06-15",
    description: "글로벌 IT 기업에서 혁신적인 제품을 개발합니다."
  },
  {
    id: "2",
    name: "네이버",
    position: "프론트엔드 개발자",
    status: "applied" as const,
    deadline: "2025-06-20",
    description: "국내 최대 포털 서비스 개발에 참여합니다."
  },
  {
    id: "3",
    name: "카카오",
    position: "백엔드 개발자",
    status: "interview" as const,
    deadline: "2025-06-10",
    description: "수억 명이 사용하는 서비스의 백엔드를 담당합니다."
  },
  {
    id: "4",
    name: "토스",
    position: "풀스택 개발자",
    status: "passed" as const,
    deadline: "2025-05-30",
    description: "금융 혁신을 이끄는 핀테크 회사입니다."
  }
];

const statusConfig = {
  pending: { label: "지원예정", color: "bg-gray-100 text-gray-800" },
  applied: { label: "서류접수", color: "bg-blue-100 text-blue-800" },
  aptitude: { label: "필기시험", color: "bg-yellow-100 text-yellow-800" },
  interview: { label: "면접", color: "bg-purple-100 text-purple-800" },
  passed: { label: "최종합격", color: "bg-green-100 text-green-800" },
  rejected: { label: "불합격", color: "bg-red-100 text-red-800" }
};

const DemoKanbanBoard = () => {
  const [companies, setCompanies] = useState(demoCompanies);
  const { toast } = useToast();

  const handleDemoAction = (action: string) => {
    toast({
      title: "데모 모드입니다",
      description: `실제로 ${action}하려면 회원가입 후 이용해주세요!`,
    });
  };

  const getCompaniesByStatus = (status: string) => {
    return companies.filter(company => company.status === status);
  };

  const StatusColumn = ({ status, title }: { status: string; title: string }) => (
    <div className="flex-1 min-w-80">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {getCompaniesByStatus(status).length}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {getCompaniesByStatus(status).map((company) => (
            <Card key={company.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium text-gray-900 mb-1">
                      {company.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-600">
                      {company.position}
                    </CardDescription>
                  </div>
                  <Badge className={statusConfig[company.status as keyof typeof statusConfig].color}>
                    {statusConfig[company.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {company.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>마감: {company.deadline}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2"
                    onClick={() => handleDemoAction("수정")}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button 
            variant="dashed" 
            className="w-full py-8 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
            onClick={() => handleDemoAction("회사 추가")}
          >
            <Plus className="w-4 h-4 mr-2" />
            회사 추가하기
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg border">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">데모 체험하기</h2>
        <p className="text-gray-600">실제 기능을 체험해보세요! (데모 데이터입니다)</p>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-4">
        <StatusColumn status="pending" title="지원예정" />
        <StatusColumn status="applied" title="서류접수" />
        <StatusColumn status="interview" title="면접" />
        <StatusColumn status="passed" title="최종합격" />
      </div>
    </div>
  );
};

export default DemoKanbanBoard;
