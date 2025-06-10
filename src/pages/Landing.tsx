
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            취업 준비를{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              체계적으로
            </span>{" "}
            관리하세요
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-medium">
            잡트래커와 함께 지원 현황을 한눈에 파악하고,
            <br />
            성공적인 취업을 위한 모든 과정을 체계적으로 관리해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {!user ? (
              <Button 
                size="lg" 
                className="text-lg px-10 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                onClick={() => navigate('/auth')}
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="text-lg px-10 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                onClick={() => navigate('/dashboard')}
              >
                대시보드로 이동
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            왜 잡트래커를 선택해야 할까요?
          </h2>
          <p className="text-gray-600 text-xl font-medium">
            취업 준비의 모든 과정을 효율적으로 관리할 수 있는 핵심 기능들
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">지원 현황 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                칸반 보드 형태로 지원 단계별
                <br />
                현황을 간편하게 관리하세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">통계 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                지원 현황과 성공률을 분석하여
                <br />
                전략적인 취업 준비가 가능합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">일정 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                면접 일정과 지원 마감일을 캘린더로 관리하고 알림을 받으세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm hover:scale-105">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">진행 상황 추적</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                지원부터 최종 합격까지
                <br />
                모든 단계의 진행 상황을 체계적으로
                <br />
                기록하세요.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            지금 바로 체험해보세요
          </h2>
          <p className="text-gray-600 text-xl font-medium">
            {!user ? "회원가입 없이도 주요 기능을 미리 체험할 수 있습니다" : "잡트래커의 주요 기능들을 살펴보세요"}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border-0">
          <DemoKanbanBoard />
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              지금 시작해서 체계적인 취업 준비를 경험하세요
            </h2>
            <p className="text-xl text-indigo-100 mb-10 font-medium">
              많은 취업 준비생들이 이미 잡트래커와 함께하고 있습니다
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-10 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-indigo-600 hover:bg-gray-50"
              onClick={() => navigate('/auth')}
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">
            © 2025 잡트래커. 모든 권리 보유.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
