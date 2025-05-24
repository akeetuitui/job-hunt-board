
import { Company } from "@/pages/Index";
import { StatusColumn } from "./kanban/StatusColumn";
import { useKanbanState } from "@/hooks/useKanbanState";
import { ScrollArea } from "./ui/scroll-area";

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
    <div className="mt-6 overflow-hidden">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex gap-4 pb-4 px-1 min-w-max">
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
      </ScrollArea>
    </div>
  );
};
