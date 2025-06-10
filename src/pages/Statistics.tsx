
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { ApplicationStagesChart } from "@/components/stats/ApplicationStagesChart";
import { TimelineChart } from "@/components/stats/TimelineChart";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Statistics = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    companies,
    isLoading: isLoadingCompanies,
  } = useCompanies();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking auth or loading companies
  if (loading || isLoadingCompanies) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-gray-600 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              지원 통계 대시보드
            </h1>
            <p className="text-gray-600 font-medium">지원현황을 분석하고 효과적으로 관리하세요</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <StatsOverview companies={companies} />
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              단계별 지원현황
            </h2>
            <div className="h-[280px]">
              <ApplicationStagesChart companies={companies} />
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 overflow-hidden animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              지원 타임라인
            </h2>
            <div className="h-[380px]">
              <TimelineChart companies={companies} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
