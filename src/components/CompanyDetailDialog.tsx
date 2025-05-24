
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, FileText, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyDetailDialogProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (company: Company) => void;
}

export const CompanyDetailDialog = ({ 
  company, 
  isOpen, 
  onClose, 
  onUpdate 
}: CompanyDetailDialogProps) => {
  const [formData, setFormData] = useState(company);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(company);
  }, [company]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    toast({
      title: "저장 완료",
      description: "기업 정보가 성공적으로 저장되었습니다.",
    });
  };

  const getStatusColor = (status: Company["status"]) => {
    const colors = {
      pending: "bg-gray-500",
      applied: "bg-blue-500",
      interview: "bg-yellow-500", 
      passed: "bg-green-500",
      rejected: "bg-red-500"
    };
    return colors[status];
  };

  const getStatusText = (status: Company["status"]) => {
    const texts = {
      pending: "지원예정",
      applied: "지원완료",
      interview: "면접중",
      passed: "합격", 
      rejected: "불합격"
    };
    return texts[status];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">{company.name}</DialogTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-white text-xs ${getStatusColor(company.status)}`}>
                  {getStatusText(company.status)}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(company.applicationDate).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info" className="flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              기업 정보
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              자기소개서
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">기업명</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">지원 직무</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">지원 상태</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="applicationDate">지원 날짜</Label>
              <Input
                id="applicationDate"
                type="date"
                value={formData.applicationDate}
                onChange={(e) => handleInputChange("applicationDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">기업 설명</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="기업에 대한 상세한 정보를 입력하세요"
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="cover-letter" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">자기소개서</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter || ""}
                onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                placeholder="이 기업에 지원할 때 사용할 자기소개서를 작성하세요..."
                rows={15}
                className="resize-none"
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>💡 팁: 기업별로 맞춤형 자기소개서를 작성하여 지원 성공률을 높이세요!</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
