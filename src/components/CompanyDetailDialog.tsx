import { useState, useEffect } from "react";
import { Company, CoverLetterSection, PositionType } from "@/pages/Index";
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
import { Building2, Calendar, FileText, Save, Plus, Trash2, Text, Clock, Link as LinkIcon, UserRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";

interface CompanyDetailDialogProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Company>) => void;
}

export const CompanyDetailDialog = ({ 
  company, 
  isOpen, 
  onClose, 
  onUpdate 
}: CompanyDetailDialogProps) => {
  const [formData, setFormData] = useState<Company>(company);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      ...company,
      coverLetterSections: company.coverLetterSections || []
    });
  }, [company]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(company.id, formData);
    toast({
      title: "저장 완료",
      description: "기업 정보가 성공적으로 저장되었습니다.",
    });
  };

  const getStatusColor = (status: Company["status"]) => {
    const colors = {
      pending: "bg-gray-500",
      applied: "bg-blue-500",
      aptitude: "bg-purple-500",
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
      aptitude: "인적성/역량 검사", 
      interview: "면접중", 
      passed: "합격", 
      rejected: "불합격"
    };
    return texts[status];
  };

  const addCoverLetterSection = () => {
    const newSection: CoverLetterSection = {
      id: `section-${Date.now()}`,
      title: "새 항목",
      content: "",
      maxLength: 500
    };

    setFormData(prev => ({
      ...prev,
      coverLetterSections: [...(prev.coverLetterSections || []), newSection]
    }));
  };

  const updateCoverLetterSection = (id: string, field: keyof CoverLetterSection, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      coverLetterSections: prev.coverLetterSections?.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      ) || []
    }));
  };

  const removeCoverLetterSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      coverLetterSections: prev.coverLetterSections?.filter(section => section.id !== id) || []
    }));
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '';
    
    if (dateString.includes('T')) {
      // If it includes time, format with both date and time
      return new Date(dateString).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // Otherwise just format the date
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{company.name}</DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge className={`text-white text-xs ${getStatusColor(company.status)}`}>
                  {getStatusText(company.status)}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  작성일: {formatDate(company.createdAt)}
                </span>
                {company.deadline && (
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    마감: {formatDate(company.deadline)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              기업 정보
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              자기소개서
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">기업명</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-700">지원 직무</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionType" className="text-gray-700">포지션 타입</Label>
              <Select 
                value={formData.positionType || ""} 
                onValueChange={(value) => handleInputChange("positionType", value as PositionType)}
              >
                <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                  <SelectValue placeholder="포지션 타입 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="신입">신입</SelectItem>
                  <SelectItem value="채용전환형인턴">채용전환형인턴</SelectItem>
                  <SelectItem value="체험형인턴">체험형인턴</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">지원 상태</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="pending">지원 예정</SelectItem>
                    <SelectItem value="applied">지원 완료</SelectItem>
                    <SelectItem value="aptitude">인적성/역량 검사</SelectItem>
                    <SelectItem value="interview">면접 진행</SelectItem>
                    <SelectItem value="passed">최종 합격</SelectItem>
                    <SelectItem value="rejected">불합격</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-gray-700">마감일시</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline || ""}
                  onChange={(e) => handleInputChange("deadline", e.target.value)}
                  className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="applicationLink" className="text-gray-700 flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                지원 링크
              </Label>
              <Input
                id="applicationLink"
                type="url"
                value={formData.applicationLink || ""}
                onChange={(e) => handleInputChange("applicationLink", e.target.value)}
                placeholder="https://"
                className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">지원 메모</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="기업에 대한 메모나 지원 관련 정보를 입력하세요"
                rows={4}
                className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
          </TabsContent>

          <TabsContent value="cover-letter" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">자기소개서 항목</h3>
              <Button 
                onClick={addCoverLetterSection} 
                variant="outline" 
                className="flex items-center text-teal-600 border-teal-600 hover:bg-teal-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                항목 추가
              </Button>
            </div>

            {formData.coverLetterSections && formData.coverLetterSections.length > 0 ? (
              <div className="space-y-6">
                {formData.coverLetterSections.map((section, index) => (
                  <Card key={section.id} className="border border-gray-200">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <Label htmlFor={`section-title-${index}`} className="text-gray-700 flex items-center">
                            <Text className="w-4 h-4 mr-2" />
                            항목 제목
                          </Label>
                          <Input
                            id={`section-title-${index}`}
                            value={section.title}
                            onChange={(e) => updateCoverLetterSection(section.id, "title", e.target.value)}
                            className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeCoverLetterSection(section.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`section-content-${index}`} className="text-gray-700">항목 내용</Label>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`section-limit-${index}`} className="text-xs text-gray-500">최대 글자수</Label>
                            <Input
                              id={`section-limit-${index}`}
                              type="number"
                              value={section.maxLength || ""}
                              onChange={(e) => updateCoverLetterSection(section.id, "maxLength", parseInt(e.target.value))}
                              className="w-20 h-7 text-xs py-0 border-gray-300"
                            />
                          </div>
                        </div>
                        
                        <Textarea
                          id={`section-content-${index}`}
                          value={section.content}
                          onChange={(e) => updateCoverLetterSection(section.id, "content", e.target.value)}
                          placeholder="내용을 입력하세요"
                          rows={6}
                          className="border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        />
                        
                        <div className="flex justify-end">
                          <span className={`text-xs ${section.maxLength && section.content.length > section.maxLength ? "text-red-500 font-semibold" : "text-gray-500"}`}>
                            {section.content.length} / {section.maxLength || "제한 없음"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-600">자기소개서 항목이 없습니다.</p>
                <p className="text-gray-400 text-sm">위의 '항목 추가' 버튼을 클릭하여 자기소개서를 작성하세요.</p>
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-yellow-800">
                💡 <strong>팁:</strong> 기업별로 맞춤형 자기소개서를 작성하여 지원 성공률을 높이세요. 기업의 핵심 가치와 직무에 필요한 역량을 강조하면 좋습니다.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
            닫기
          </Button>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 shadow-sm">
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
