
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navigation = [
    { name: "지원현황", href: "/dashboard" },
    { name: "통계", href: "/statistics" },
    { name: "일정", href: "/calendar" },
    { name: "마이그레이션", href: "/migration" },
    { name: "설정", href: "/settings" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              잡트래커
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm",
                    location.pathname === item.href
                      ? "text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 shadow-sm"
                      : "text-gray-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-white/50 backdrop-blur-sm transition-all duration-300">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">소개</span>
              </Button>
            </Link>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-white/50 backdrop-blur-sm transition-all duration-300">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl">
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center hover:bg-white/50 transition-all duration-300">
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
