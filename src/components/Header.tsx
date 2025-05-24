
import { Building2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-teal-600 font-medium" : "text-gray-600 hover:text-teal-600";
  };
  
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-lg shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                JobTracker
              </h1>
              <p className="text-sm text-gray-500">취업 지원현황 관리 시스템</p>
            </div>
          </div>
          
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  to="/" 
                  className={`text-sm transition-colors ${isActive('/')}`}
                >
                  대시보드
                </Link>
              </li>
              <li>
                <Link 
                  to="/statistics" 
                  className={`text-sm transition-colors ${isActive('/statistics')}`}
                >
                  통계
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
                >
                  캘린더
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
                >
                  설정
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
