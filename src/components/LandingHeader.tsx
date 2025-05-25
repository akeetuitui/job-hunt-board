
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const LandingHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              JobTracker
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                로그인
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                무료 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
