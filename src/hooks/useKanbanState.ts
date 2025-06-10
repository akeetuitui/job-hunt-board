
import { useState } from "react";
import { Company } from "@/pages/Index";

interface StatusConfig {
  title: string;
  color: string;
  shadow: string;
}

type StatusConfigMap = Record<string, StatusConfig>;

export const useKanbanState = () => {
  const defaultStatusConfig: StatusConfigMap = {
    pending: { 
      title: "지원 예정", 
      color: "bg-white border-gray-200", 
      shadow: "ring-gray-200" 
    },
    applied: { 
      title: "지원 완료", 
      color: "bg-blue-50/30 border-blue-200", 
      shadow: "ring-blue-200" 
    },
    aptitude: { 
      title: "인적성/역량 검사", 
      color: "bg-purple-50/30 border-purple-200", 
      shadow: "ring-purple-200" 
    },
    interview: { 
      title: "면접 진행", 
      color: "bg-yellow-50/30 border-yellow-200", 
      shadow: "ring-yellow-200" 
    },
    passed: { 
      title: "최종 합격", 
      color: "bg-green-50/30 border-green-200", 
      shadow: "ring-green-200" 
    },
    rejected: { 
      title: "불합격", 
      color: "bg-red-50/30 border-red-200", 
      shadow: "ring-red-200" 
    }
  };

  const [statusConfig, setStatusConfig] = useState<StatusConfigMap>(defaultStatusConfig);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<Company["status"] | null>(null);

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

  const handleDrop = (e: React.DragEvent, status: Company["status"], companies: Company[], onUpdateCompany: (id: string, updates: Partial<Company>) => void) => {
    e.preventDefault();
    
    if (draggedItem) {
      const company = companies.find(c => c.id === draggedItem);
      if (company && company.status !== status) {
        onUpdateCompany(company.id, { status });
      }
    }
    
    setDraggedItem(null);
    setIsDraggingOver(null);
  };

  const handleEditStatusTitle = (status: string, newTitle: string) => {
    setStatusConfig({
      ...statusConfig,
      [status]: {
        ...statusConfig[status],
        title: newTitle
      }
    });
  };

  return {
    statusConfig,
    draggedItem,
    isDraggingOver,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleEditStatusTitle
  };
};
