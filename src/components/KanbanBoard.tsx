
import { useState } from "react";
import { Company } from "@/pages/Index";
import { CompanyCard } from "./CompanyCard";
import { cn } from "@/lib/utils";
import { AlertCircle, Plus, Edit2, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface KanbanBoardProps {
  companies: Company[];
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

interface StatusConfig {
  title: string;
  color: string;
  shadow: string;
}

type StatusConfigMap = Record<string, StatusConfig>;

export const KanbanBoard = ({ companies, onUpdateCompany, onDeleteCompany }: KanbanBoardProps) => {
  const defaultStatusConfig: StatusConfigMap = {
    pending: { title: "지원 예정", color: "bg-gray-100 border-gray-200", shadow: "shadow-gray-200" },
    applied: { title: "지원 완료", color: "bg-blue-50 border-blue-200", shadow: "shadow-blue-100" },
    aptitude: { title: "인적성/역량 검사", color: "bg-purple-50 border-purple-200", shadow: "shadow-purple-100" },
    interview: { title: "면접 진행", color: "bg-yellow-50 border-yellow-200", shadow: "shadow-yellow-100" },
    passed: { title: "최종 합격", color: "bg-green-50 border-green-200", shadow: "shadow-green-100" },
    rejected: { title: "불합격", color: "bg-red-50 border-red-200", shadow: "shadow-red-100" }
  };

  const [statusConfig, setStatusConfig] = useState<StatusConfigMap>(defaultStatusConfig);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<Company["status"] | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleDragStart = (e: React.DragEvent, companyId: string) => {
    setDraggedItem(companyId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: Company["status"]) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(status);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(null);
  };

  const handleDrop = (e: React.DragEvent, status: Company["status"]) => {
    e.preventDefault();
    
    if (draggedItem) {
      const company = companies.find(c => c.id === draggedItem);
      if (company && company.status !== status) {
        onUpdateCompany({ ...company, status });
      }
    }
    setDraggedItem(null);
    setIsDraggingOver(null);
  };

  const getCompaniesByStatus = (status: Company["status"]) => {
    return companies.filter(company => company.status === status);
  };

  const handleEditStatus = (status: string) => {
    setEditingStatus(status);
    setEditingTitle(statusConfig[status].title);
  };

  const handleSaveStatusTitle = (status: string) => {
    setStatusConfig({
      ...statusConfig,
      [status]: {
        ...statusConfig[status],
        title: editingTitle
      }
    });
    setEditingStatus(null);
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      {Object.entries(statusConfig).map(([status, config]) => (
        <div
          key={status}
          className={cn(
            "rounded-lg border-2 border-dashed p-4 min-h-[500px] transition-all duration-200",
            config.color,
            isDraggingOver === status && `border-solid ${config.shadow} bg-opacity-70`
          )}
          onDragOver={(e) => handleDragOver(e, status as Company["status"])}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status as Company["status"])}
        >
          <div className="flex items-center justify-between mb-4">
            {editingStatus === status ? (
              <div className="flex items-center space-x-2 w-full">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="text-sm py-1 h-8"
                  autoFocus
                />
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7" 
                    onClick={() => handleSaveStatusTitle(status)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7" 
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900 flex items-center">
                  {config.title}
                  <span className="ml-2 text-sm bg-white px-2 py-1 rounded-full shadow-sm">
                    {getCompaniesByStatus(status as Company["status"]).length}
                  </span>
                </h3>
                <div className="flex items-center">
                  {status === 'pending' && (
                    <Button 
                      onClick={() => window.dispatchEvent(new CustomEvent('openAddCompanyDialog'))}
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 mr-1 opacity-70 hover:opacity-100 hover:bg-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-70 hover:opacity-100"
                    onClick={() => handleEditStatus(status)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-3">
            {getCompaniesByStatus(status as Company["status"]).length === 0 && (
              <div className="flex flex-col items-center justify-center h-24 text-center text-gray-400 border border-dashed rounded-md p-4">
                {status === 'pending' ? (
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent('openAddCompanyDialog'))}
                    variant="ghost"
                    className="flex flex-col items-center justify-center h-full w-full text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                  >
                    <Plus className="w-5 h-5 mb-1" />
                    <p className="text-xs">기업 추가하기</p>
                  </Button>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 mb-1" />
                    <p className="text-xs">항목을 이 영역으로 드래그하세요</p>
                  </>
                )}
              </div>
            )}
            
            {getCompaniesByStatus(status as Company["status"]).map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onUpdate={onUpdateCompany}
                onDelete={onDeleteCompany}
                onDragStart={(e) => handleDragStart(e, company.id)}
                isDragging={draggedItem === company.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
