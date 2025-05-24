
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export interface CoverLetterSection {
  id: string;
  title: string;
  content: string;
  maxLength?: number;
}

export type PositionType = "신입" | "채용전환형인턴" | "체험형인턴";

export interface Company {
  id: string;
  name: string;
  position: string;
  positionType?: PositionType;
  status: "pending" | "applied" | "aptitude" | "interview" | "passed" | "rejected";
  deadline?: string;
  description?: string;
  applicationLink?: string;
  coverLetter?: string;
  coverLetterSections?: CoverLetterSection[];
  createdAt: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const openAddDialog = () => setIsAddDialogOpen(true);
    window.addEventListener('openAddCompanyDialog', openAddDialog);
    
    return () => {
      window.removeEventListener('openAddCompanyDialog', openAddDialog);
    };
  }, []);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const addCompany = (company: Omit<Company, "id" | "createdAt">) => {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
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
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">지원현황 관리</h1>
            <p className="text-gray-600">취업 지원 현황을 한눈에 관리하세요</p>
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="shadow-sm"
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
