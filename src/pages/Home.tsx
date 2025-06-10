
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Landing from './Landing';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('Home component - user:', user, 'loading:', loading);

  useEffect(() => {
    console.log('Home useEffect - user:', user, 'loading:', loading);
    // 로딩이 완료되고 사용자가 로그인되어 있으면 대시보드로 이동
    if (!loading && user) {
      console.log('Redirecting to dashboard from Home');
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // 로딩 중이면 로딩 표시
  if (loading) {
    console.log('Home showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 사용자에게는 랜딩페이지 표시
  console.log('Home showing Landing page');
  return <Landing />;
};

export default Home;
