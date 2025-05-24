
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyColumnPlaceholderProps {
  isPending: boolean;
  onAddCompany: () => void;
}

export const EmptyColumnPlaceholder = ({ isPending, onAddCompany }: EmptyColumnPlaceholderProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-24 text-center text-gray-400 border border-dashed rounded-md p-4">
      {isPending ? (
        <Button
          onClick={onAddCompany}
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
  );
};
