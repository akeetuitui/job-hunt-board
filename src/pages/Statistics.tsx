
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Company } from "@/pages/Index";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { ApplicationStagesChart } from "@/components/stats/ApplicationStagesChart";
import { SuccessRateChart } from "@/components/stats/SuccessRateChart";
import { TimelineChart } from "@/components/stats/TimelineChart";

const Statistics = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  // Fetch companies from storage - in a real app this would come from API/localStorage
  useEffect(() => {
    // For now, we'll use the same mock data as in Index.tsx
    const mockCompanies: Company[] = [
      {
        id: "1",
        name: "네이버",
        position: "프론트엔드 개발자",
        positionType: "신입",
        status: "interview",
        deadline: "2024-06-15",
        description: "대한민국 대표 IT 기업",
        applicationLink: "https://recruit.navercorp.com",
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
        ],
        createdAt: "2023-05-20"
      },
      {
        id: "2", 
        name: "카카오",
        position: "백엔드 개발자",
        positionType: "채용전환형인턴",
        status: "aptitude",
        deadline: "2024-06-30",
        description: "모바일 플랫폼 선도기업",
        applicationLink: "https://careers.kakao.com",
        createdAt: "2023-05-21"
      },
      {
        id: "3",
        name: "삼성전자",
        position: "소프트웨어 엔지니어", 
        positionType: "체험형인턴",
        status: "passed",
        description: "글로벌 전자기업",
        createdAt: "2023-05-22"
      },
      {
        id: "4",
        name: "LG전자",
        position: "시스템 엔지니어", 
        positionType: "신입",
        status: "rejected",
        description: "글로벌 가전기업",
        createdAt: "2023-06-01"
      },
      {
        id: "5",
        name: "현대자동차",
        position: "데이터 분석가", 
        positionType: "채용전환형인턴",
        status: "applied",
        deadline: "2024-07-15",
        description: "자동차 제조기업",
        createdAt: "2023-06-05"
      },
      {
        id: "6",
        name: "SK하이닉스",
        position: "반도체 공정 엔지니어", 
        positionType: "신입",
        status: "passed",
        description: "반도체 제조기업",
        createdAt: "2023-06-10"
      }
    ];
    setCompanies(mockCompanies);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">지원 통계 대시보드</h1>
          <p className="text-gray-600">지원현황을 분석하고 효과적으로 관리하세요</p>
        </div>

        <div className="grid gap-6">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <StatsOverview companies={companies} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">단계별 지원현황</h2>
              <div className="h-[280px]">
                <ApplicationStagesChart companies={companies} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">지원 성공률</h2>
              <div className="h-[280px]">
                <SuccessRateChart companies={companies} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">지원 타임라인</h2>
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
