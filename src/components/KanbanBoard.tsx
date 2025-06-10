
import { useKanbanState } from "@/hooks/useKanbanState";
import { StatusColumn } from "./kanban/StatusColumn";
import { Company } from "@/pages/Index";
import { MigrationInfoButton } from "./MigrationInfoButton";

interface KanbanBoardProps {
  companies: Company[];
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

const KanbanBoard = ({ companies, onUpdateCompany, onDeleteCompany }: KanbanBoardProps) => {
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

  const handleAddCompany = () => {
    window.dispatchEvent(new Event('openAddCompanyDialog'));
  };

  const statuses: Company["status"][] = ["pending", "applied", "aptitude", "interview", "passed", "rejected"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">지원 현황 관리</h2>
          <MigrationInfoButton />
        </div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            statusConfig={statusConfig[status]}
            companies={companies}
            isDraggingOver={isDraggingOver === status}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status, companies, onUpdateCompany)}
            onEditTitle={handleEditStatusTitle}
            onUpdateCompany={onUpdateCompany}
            onDeleteCompany={onDeleteCompany}
            onDragStart={handleDragStart}
            draggedItem={draggedItem}
            onAddCompany={handleAddCompany}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
