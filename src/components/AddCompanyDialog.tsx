
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Company } from "@/pages/Index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (company: Omit<Company, "id" | "createdAt">) => void;
}

export const AddCompanyDialog = ({ isOpen, onClose, onAdd }: AddCompanyDialogProps) => {
  const [open, setOpen] = useState(isOpen);
  const form = useForm({
    defaultValues: {
      name: "",
      position: "",
      status: "pending",
      deadline: "",
      description: "",
      applicationLink: ""
    }
  });
  
  // Sync the open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onSubmit = (data: any) => {
    console.log('Form data before submission:', data);
    
    const newCompany: Omit<Company, "id" | "createdAt"> = {
      name: data.name,
      position: data.position,
      status: data.status || "pending",
      deadline: data.deadline || undefined,
      description: data.description || undefined,
      applicationLink: data.applicationLink || undefined
    };
    
    console.log('Company object to be added:', newCompany);
    onAdd(newCompany);
    setOpen(false);
    onClose();
    form.reset({
      name: "",
      position: "",
      status: "pending",
      deadline: "",
      description: "",
      applicationLink: ""
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>기업 추가</DialogTitle>
          <DialogDescription>
            새 기업을 추가하세요. 작성이 완료되면 저장을 누르세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              기업명
            </Label>
            <Input id="name" defaultValue="" className="col-span-3" {...form.register("name", { required: true })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              지원 직무
            </Label>
            <Input id="position" defaultValue="" className="col-span-3" {...form.register("position", { required: true })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              지원 상태
            </Label>
            <Select 
              onValueChange={(value) => {
                console.log('Status changed to:', value);
                form.setValue("status", value);
              }} 
              defaultValue="pending"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">지원 예정</SelectItem>
                <SelectItem value="applied">지원 완료</SelectItem>
                <SelectItem value="aptitude">인적성/역량 검사</SelectItem>
                <SelectItem value="interview">면접 진행</SelectItem>
                <SelectItem value="passed">합격</SelectItem>
                <SelectItem value="rejected">불합격</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              마감일시
            </Label>
            <Input 
              type="datetime-local" 
              id="deadline" 
              className="col-span-3" 
              {...form.register("deadline")} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="applicationLink" className="text-right">
              지원 링크
            </Label>
            <Input type="url" id="applicationLink" className="col-span-3" placeholder="https://" {...form.register("applicationLink")} />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              기업 설명
            </Label>
            <Textarea id="description" className="col-span-3" {...form.register("description")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">기업 추가</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
