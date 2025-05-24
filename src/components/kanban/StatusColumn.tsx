
import { Company } from "@/pages/Index";
import { CompanyCard } from "../CompanyCard";
import { StatusColumnHeader } from "./StatusColumnHeader";
import { EmptyColumnPlaceholder } from "./EmptyColumnPlaceholder";
import { cn } from "@/lib/utils";

interface StatusColumnProps {
  status: Company["status"];
  statusConfig: {
    title: string;
    color: string;
    shadow: string;
  };
  companies: Company[];
  isDraggingOver: boolean;
  onDragOver: (e: React.DragEvent, status: Company["status"]) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: Company["status"]) => void;
  onEditTitle: (status: string, newTitle: string) => void;
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
  onDragStart: (e: React.DragEvent, companyId: string) => void;
  draggedItem: string | null;
  onAddCompany: () => void;
}

export const StatusColumn = ({
  status,
  statusConfig,
  companies,
  isDraggingOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onEditTitle,
  onUpdateCompany,
  onDeleteCompany,
  onDragStart,
  draggedItem,
  onAddCompany
}: StatusColumnProps) => {
  const columnCompanies = companies.filter(company => company.status === status);
  const isPending = status === 'pending';

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-3 min-h-[500px] transition-all duration-200 flex flex-col shadow-sm",
        isDraggingOver && `ring-2 ${statusConfig.shadow} bg-opacity-70`
      )}
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
    >
      <StatusColumnHeader
        status={status}
        title={statusConfig.title}
        count={columnCompanies.length}
        onEditTitle={onEditTitle}
        onAddCompany={onAddCompany}
        isPending={isPending}
      />
      
      <div className="space-y-3 flex-1 overflow-y-auto pt-2 pr-1">
        {columnCompanies.length === 0 && (
          <EmptyColumnPlaceholder 
            isPending={isPending} 
            onAddCompany={onAddCompany} 
          />
        )}
        
        {columnCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onUpdate={onUpdateCompany}
            onDelete={onDeleteCompany}
            onDragStart={(e) => onDragStart(e, company.id)}
            isDragging={draggedItem === company.id}
          />
        ))}
      </div>
    </div>
  );
};
