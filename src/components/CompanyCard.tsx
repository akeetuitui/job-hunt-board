
import { useState } from "react";
import { Company } from "@/pages/Index";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Edit, Trash2, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyDetailDialog } from "./CompanyDetailDialog";
import { cn } from "@/lib/utils";

interface CompanyCardProps {
  company: Company;
  onUpdate: (company: Company) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent) => void;
  isDragging: boolean;
}

export const CompanyCard = ({ 
  company, 
  onUpdate, 
  onDelete, 
  onDragStart, 
  isDragging 
}: CompanyCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Company["status"]) => {
    const colors = {
      pending: "bg-gray-500",
      applied: "bg-blue-500", 
      interview: "bg-yellow-500",
      passed: "bg-green-500",
      rejected: "bg-red-500"
    };
    return colors[status];
  };

  const getStatusText = (status: Company["status"]) => {
    const texts = {
      pending: "지원예정",
      applied: "지원완료",
      interview: "면접중", 
      passed: "합격",
      rejected: "불합격"
    };
    return texts[status];
  };

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart}
        className={cn(
          "cursor-move transition-all duration-200 hover:shadow-md",
          isDragging && "opacity-50 scale-95"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 truncate">{company.name}</h4>
              <p className="text-sm text-gray-600 truncate">{company.position}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  상세보기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(company.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <Badge 
              className={cn(
                "text-white text-xs",
                getStatusColor(company.status)
              )}
            >
              {getStatusText(company.status)}
            </Badge>
            
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(company.applicationDate)}
            </div>
            
            {company.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {company.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <CompanyDetailDialog
        company={company}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};
