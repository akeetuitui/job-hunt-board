import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LandingHeader from "@/components/LandingHeader";
import DemoKanbanBoard from "@/components/DemoKanbanBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, BarChart3, Calendar, ArrowRight } from "lucide-react";

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인된 사용자는 대시보드로 자동 리다이렉트
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            취업 준비를{" "}
            <span className="text-indigo-600">체계적으로</span>{" "}
            관리하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            JobTracker와 함께 지원 현황을 한눈에 파악하고, 
            성공적인 취업을 위한 모든 과정을 체계적으로 관리해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/auth')}>
              무료로 시작하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              아래에서 데모 체험하기
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            왜 JobTracker를 선택해야 할까요?
          </h2>
          <p className="text-gray-600 text-lg">
            취업 준비의 모든 과정을 효율적으로 관리할 수 있는 핵심 기능들
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">지원 현황 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                칸반 보드 형태로 지원 단계별 현황을 시각적으로 관리하고 추적하세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">통계 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                지원 현황과 성공률을 분석하여 전략적인 취업 준비가 가능합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl">일정 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                면접 일정과 지원 마감일을 캘린더로 관리하고 알림을 받으세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-xl">진행 상황 추적</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                지원부터 최종 합격까지 모든 단계의 진행 상황을 체계적으로 기록하세요.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            지금 바로 체험해보세요
          </h2>
          <p className="text-gray-600 text-lg">
            회원가입 없이도 주요 기능을 미리 체험할 수 있습니다
          </p>
        </div>

        <DemoKanbanBoard />
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 시작해서 체계적인 취업 준비를 경험하세요
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            수천 명의 취업 준비생들이 JobTracker와 함께 성공했습니다
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3"
            onClick={() => navigate('/auth')}
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 JobTracker. 모든 권리 보유.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
