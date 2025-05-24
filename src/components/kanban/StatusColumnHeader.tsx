
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Edit2, Plus, Save, X } from "lucide-react";

interface StatusColumnHeaderProps {
  status: string;
  title: string;
  count: number;
  onEditTitle: (status: string, newTitle: string) => void;
  onAddCompany?: () => void;
  isPending: boolean;
}

export const StatusColumnHeader = ({
  status,
  title,
  count,
  onEditTitle,
  onAddCompany,
  isPending
}: StatusColumnHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);

  const handleSave = () => {
    onEditTitle(status, editingTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingTitle(title);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      {isEditing ? (
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
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7" 
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-gray-900 flex items-center">
            {title}
            <span className="ml-2 text-sm bg-white px-2 py-1 rounded-full shadow-sm">
              {count}
            </span>
          </h3>
          <div className="flex items-center">
            {isPending && (
              <Button 
                onClick={onAddCompany}
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
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
