
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import ProfileSetupDialog from '@/components/ProfileSetupDialog';
import { AddCompanyDialog } from '@/components/AddCompanyDialog';
import { useCompanies } from '@/hooks/useCompanies';

// Type definitions
export type PositionType = "신입" | "채용전환형인턴" | "체험형인턴";

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
  positionType?: PositionType;
  status: "pending" | "applied" | "aptitude" | "interview" | "passed" | "rejected";
  deadline?: string;
  description?: string;
  applicationLink?: string;
  coverLetter?: string;
  coverLetterSections?: CoverLetterSection[];
  createdAt: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const navigate = useNavigate();

  const {
    companies,
    isLoading: companiesLoading,
    addCompany,
    updateCompany,
    deleteCompany,
  } = useCompanies();

  useEffect(() => {
    // 인증 상태가 로딩 중이면 기다림
    if (authLoading) return;

    // 사용자가 로그인되지 않았으면 로그인 페이지로 리다이렉트
    if (!user) {
      navigate('/auth');
      return;
    }

    // 프로필이 로딩 중이면 기다림
    if (profileLoading) return;

    // 사용자는 로그인되어 있지만 프로필 정보가 없거나 불완전하면 프로필 설정 다이얼로그 표시
    if (profile && (!profile.university || !profile.major)) {
      setShowProfileSetup(true);
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  useEffect(() => {
    const handleOpenDialog = () => {
      setShowAddCompanyDialog(true);
    };

    window.addEventListener('openAddCompanyDialog', handleOpenDialog);
    return () => {
      window.removeEventListener('openAddCompanyDialog', handleOpenDialog);
    };
  }, []);

  const handleProfileSetupClose = () => {
    setShowProfileSetup(false);
  };

  const handleAddCompany = (company: Omit<Company, "id" | "createdAt">) => {
    addCompany(company);
    setShowAddCompanyDialog(false);
  };

  // 인증 또는 프로필 로딩 중이면 로딩 표시
  if (authLoading || profileLoading || companiesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 사용자가 로그인되지 않았으면 아무것도 렌더링하지 않음 (useEffect에서 리다이렉트)
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <KanbanBoard 
            companies={companies}
            onUpdateCompany={updateCompany}
            onDeleteCompany={deleteCompany}
          />
        </main>
      </div>

      <ProfileSetupDialog 
        open={showProfileSetup} 
        onClose={handleProfileSetupClose}
      />

      <AddCompanyDialog
        isOpen={showAddCompanyDialog}
        onClose={() => setShowAddCompanyDialog(false)}
        onAdd={handleAddCompany}
      />
    </>
  );
};

export default Dashboard;
