
import { useState } from "react";
import { Header } from "@/components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface CoverLetterSection {
  id: string;
  title: string;
  content: string;
  maxLength?: number;
}

export interface Company {
  id: string;
  name: string;
  position: string;
  status: "applied" | "pending" | "interview" | "passed" | "rejected";
  applicationDate: string;
  deadline?: string;
  description?: string;
  coverLetter?: string;
  coverLetterSections?: CoverLetterSection[];
}

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "네이버",
      position: "프론트엔드 개발자",
      status: "interview",
      applicationDate: "2024-05-20",
      deadline: "2024-06-15",
      description: "대한민국 대표 IT 기업",
      coverLetterSections: [
        {
          id: "section1",
          title: "지원 동기",
          content: "네이버의 기술력과 혁신적인 서비스에 감명받아 지원하게 되었습니다.",
          maxLength: 500
        },
        {
          id: "section2",
          title: "자신의 강점",
          content: "프론트엔드 개발에 대한 깊은 이해와 사용자 경험을 중시하는 개발 철학을 가지고 있습니다.",
          maxLength: 500
        }
      ]
    },
    {
      id: "2", 
      name: "카카오",
      position: "백엔드 개발자",
      status: "applied",
      applicationDate: "2024-05-22",
      deadline: "2024-06-30",
      description: "모바일 플랫폼 선도기업"
    },
    {
      id: "3",
      name: "삼성전자",
      position: "소프트웨어 엔지니어", 
      status: "passed",
      applicationDate: "2024-05-15",
      description: "글로벌 전자기업"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addCompany = (company: Omit<Company, "id">) => {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString()
    };
    setCompanies([...companies, newCompany]);
  };

  const updateCompany = (updatedCompany: Company) => {
    setCompanies(companies.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    ));
  };

  const deleteCompany = (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">지원현황 관리</h1>
            <p className="text-gray-600">취업 지원 현황을 한눈에 관리하세요</p>
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            기업 추가
          </Button>
        </div>

        <KanbanBoard 
          companies={companies}
          onUpdateCompany={updateCompany}
          onDeleteCompany={deleteCompany}
        />

        <AddCompanyDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={addCompany}
        />
      </main>
    </div>
  );
};

export default Index;
