
import { useState } from "react";
import { Company, PositionType } from "@/pages/Index";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Trash2, Calendar, Briefcase, Edit2, UserRound, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyDetailDialog } from "./CompanyDetailDialog";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";

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
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [deadline, setDeadline] = useState(company.deadline || "");
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    if (dateString.includes('T')) {
      // If it includes time, format with both date and time
      return new Date(dateString).toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // Otherwise just format the date
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Company["status"]) => {
    const colors = {
      pending: "bg-slate-500",
      applied: "bg-blue-500", 
      aptitude: "bg-purple-500",
      interview: "bg-amber-500",
      passed: "bg-emerald-500",
      rejected: "bg-rose-500"
    };
    return colors[status];
  };

  const getStatusText = (status: Company["status"]) => {
    const texts = {
      pending: "지원예정",
      applied: "지원완료",
      aptitude: "인적성/역량 검사", 
      interview: "면접중", 
      passed: "합격",
      rejected: "불합격"
    };
    return texts[status];
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  const saveDeadline = () => {
    onUpdate({ ...company, deadline });
    setIsEditingDeadline(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open detail if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input, [data-dropdown-trigger]')) {
      return;
    }
    setIsDetailOpen(true);
  };

  const handleApplicationLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (company.applicationLink) {
      window.open(company.applicationLink, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "지원 링크가 없습니다",
        description: "상세보기에서 지원 링크를 추가해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart}
        onClick={handleCardClick}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-100 group hover:border-gray-200 rounded-lg overflow-hidden",
          isDragging && "opacity-50 scale-95"
        )}
      >
        <CardHeader className="pb-2 px-4 py-3 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 truncate">{company.name}</h4>
                {company.positionType && (
                  <span className="text-xs text-gray-500">
                    {company.positionType}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 truncate flex items-center gap-1 mt-1">
                <Briefcase className="w-3 h-3" />
                {company.position}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                      onClick={handleApplicationLinkClick}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{company.applicationLink ? "지원 링크로 이동" : "지원 링크 추가 필요"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild data-dropdown-trigger>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    상세보기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(company.id)} className="text-red-600 focus:text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-4 py-3 pt-0 space-y-2 bg-white">
          <div className="flex justify-between items-center">
            <Badge 
              className={cn(
                "text-white text-xs py-1 px-2 rounded-md font-medium",
                getStatusColor(company.status)
              )}
            >
              {getStatusText(company.status)}
            </Badge>
            
            {(company.deadline || isEditingDeadline) && (
              <div className="flex items-center text-xs text-gray-500">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-pointer group" onClick={() => setIsEditingDeadline(true)}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {isEditingDeadline ? (
                          <Input
                            type="datetime-local"
                            value={deadline}
                            onChange={handleDeadlineChange}
                            className="h-6 text-xs py-0 px-2 w-32 rounded-md"
                            onBlur={saveDeadline}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span>
                            {company.deadline ? formatDate(company.deadline) : "마감일시 설정"}
                          </span>
                        )}
                        <Edit2 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>클릭하여 마감일시를 수정하세요</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
