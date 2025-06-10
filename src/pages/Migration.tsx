
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MigrationUploadDialog from "@/components/migration/MigrationUploadDialog";
import MigrationRequestsList from "@/components/migration/MigrationRequestsList";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Upload, FileText } from "lucide-react";

const Migration = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-gray-600 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  데이터 마이그레이션
                </h1>
                <p className="text-gray-600 font-medium">기존 지원현황 데이터를 잡트래커로 이전하세요</p>
              </div>
              <MigrationUploadDialog />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                마이그레이션 요청 내역
              </h2>
            </div>
            <MigrationRequestsList />
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                지원하는 파일 형식
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                <FileText className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-green-800 mb-1">Excel 파일</h3>
                <p className="text-sm text-green-700">.xlsx, .xls 형식의 엑셀 파일</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200/50">
                <FileText className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-red-800 mb-1">PDF 파일</h3>
                <p className="text-sm text-red-700">.pdf 형식의 문서 파일</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-blue-800 mb-1">CSV 파일</h3>
                <p className="text-sm text-blue-700">.csv 형식의 데이터 파일</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Migration;
