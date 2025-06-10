
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export const MigrationInfoButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleMigrationClick = () => {
    navigate('/migration');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">📊 데이터 마이그레이션</h4>
          <p className="text-sm text-gray-600">
            기존에 엑셀이나 다른 도구에서 관리하던 지원현황 데이터가 있다면, 
            손쉽게 잡트래커로 옮겨올 수 있습니다.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleMigrationClick}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              마이그레이션하기
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              나중에
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
