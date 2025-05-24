
import { Company } from "@/pages/Index";
import { StatusColumn } from "./kanban/StatusColumn";
import { useKanbanState } from "@/hooks/useKanbanState";

interface KanbanBoardProps {
  companies: Company[];
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

export const KanbanBoard = ({ companies, onUpdateCompany, onDeleteCompany }: KanbanBoardProps) => {
  const {
    statusConfig,
    draggedItem,
    isDraggingOver,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleEditStatusTitle
  } = useKanbanState();

  const handleDropWrapper = (e: React.DragEvent, status: Company["status"]) => {
    handleDrop(e, status, companies, onUpdateCompany);
  };

  const handleAddCompany = () => {
    window.dispatchEvent(new CustomEvent('openAddCompanyDialog'));
  };

  // Status types to ensure we render all columns
  const statuses: Company["status"][] = [
    "pending", 
    "applied", 
    "aptitude", 
    "interview", 
    "passed", 
    "rejected"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      {statuses.map((status) => (
        <StatusColumn
          key={status}
          status={status}
          statusConfig={statusConfig[status]}
          companies={companies}
          isDraggingOver={isDraggingOver === status}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropWrapper}
          onEditTitle={handleEditStatusTitle}
          onUpdateCompany={onUpdateCompany}
          onDeleteCompany={onDeleteCompany}
          onDragStart={handleDragStart}
          draggedItem={draggedItem}
          onAddCompany={handleAddCompany}
        />
      ))}
    </div>
  );
};
