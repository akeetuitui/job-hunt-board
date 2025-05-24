import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const form = useForm();

  const onSubmit = (data: any) => {
    const newCompany = {
      name: data.name,
      position: data.position,
      status: data.status as Company["status"],
      deadline: data.deadline,
      description: data.description,
      createdAt: new Date().toISOString().split('T')[0] // Adding the missing field
    };
    
    onAdd(newCompany);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Company</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>
            Add a new company to your list. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="" className="col-span-3" {...form.register("name")} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Position
            </Label>
            <Input id="position" defaultValue="" className="col-span-3" {...form.register("position")} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select {...form.register("status")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="aptitude">Aptitude</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Deadline
            </Label>
            <Input type="date" id="deadline" className="col-span-3" {...form.register("deadline")} />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea id="description" className="col-span-3" {...form.register("description")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Company</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
