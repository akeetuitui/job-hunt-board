
import { useState } from "react";
import { Company } from "@/pages/Index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (company: Omit<Company, "id">) => void;
}

export const AddCompanyDialog = ({ isOpen, onClose, onAdd }: AddCompanyDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    status: "pending" as Company["status"],
    applicationDate: new Date().toISOString().split('T')[0],
    deadline: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      position: "", 
      status: "pending",
      applicationDate: new Date().toISOString().split('T')[0],
      deadline: "",
      description: ""
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">새 기업 추가</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">기업명</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="기업명을 입력하세요"
              required
              className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">지원 직무</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              placeholder="지원 직무를 입력하세요"
              required
              className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">지원 상태</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="pending">지원 예정</SelectItem>
                <SelectItem value="applied">지원 완료</SelectItem>
                <SelectItem value="interview">면접 진행</SelectItem>
                <SelectItem value="passed">최종 합격</SelectItem>
                <SelectItem value="rejected">불합격</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationDate">지원 날짜</Label>
              <Input
                id="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                required
                className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">마감일</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">기업 설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="기업에 대한 간단한 설명을 입력하세요"
              rows={3}
              className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
