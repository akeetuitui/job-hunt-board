
import { useState } from "react";
import { Company } from "@/pages/Index";
import { CompanyCard } from "./CompanyCard";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  companies: Company[];
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

const statusConfig = {
  pending: { title: "지원 예정", color: "bg-gray-100 border-gray-200" },
  applied: { title: "지원 완료", color: "bg-blue-50 border-blue-200" },
  interview: { title: "면접 진행", color: "bg-yellow-50 border-yellow-200" },
  passed: { title: "최종 합격", color: "bg-green-50 border-green-200" },
  rejected: { title: "불합격", color: "bg-red-50 border-red-200" }
};

export const KanbanBoard = ({ companies, onUpdateCompany, onDeleteCompany }: KanbanBoardProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, companyId: string) => {
    setDraggedItem(companyId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
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
  };

  const getCompaniesByStatus = (status: Company["status"]) => {
    return companies.filter(company => company.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {Object.entries(statusConfig).map(([status, config]) => (
        <div
          key={status}
          className={cn(
            "rounded-lg border-2 border-dashed p-4 min-h-[500px]",
            config.color
          )}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status as Company["status"])}
        >
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            {config.title}
            <span className="ml-2 text-sm bg-white px-2 py-1 rounded-full">
              {getCompaniesByStatus(status as Company["status"]).length}
            </span>
          </h3>
          
          <div className="space-y-3">
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
