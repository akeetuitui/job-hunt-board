
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home, Bell, Check, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNotifications } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRoles();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    isMarkingAllAsRead 
  } = useNotifications();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const navigation = [
    { name: "지원현황", href: "/dashboard" },
    { name: "통계", href: "/statistics" },
    { name: "일정", href: "/calendar" },
    { name: "설정", href: "/settings" },
  ];

  // 관리자에게만 관리자 메뉴 표시
  const adminNavigation = isAdmin ? [
    { name: "관리자", href: "/admin", icon: Shield },
  ] : [];

  const allNavigation = [...navigation, ...adminNavigation];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              잡트래커
            </Link>
            <nav className="hidden md:flex space-x-6">
              {allNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm flex items-center gap-2",
                    location.pathname === item.href
                      ? "text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 shadow-sm"
                      : "text-gray-600"
                  )}
                >
                  {'icon' in item && item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center hover:bg-white/50 backdrop-blur-sm transition-all duration-300">
                <Home className="w-4 h-4" />
              </Button>
            </Link>

            {user && (
              <>
                {/* 알림 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative flex items-center hover:bg-white/50 backdrop-blur-sm transition-all duration-300">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between p-3">
                      <DropdownMenuLabel className="font-semibold p-0">알림</DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          disabled={isMarkingAllAsRead}
                          className="h-auto p-1 text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          모두 읽음
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        새로운 알림이 없습니다.
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <DropdownMenuItem 
                            key={notification.id}
                            className="flex flex-col items-start p-4 hover:bg-white/50 transition-all duration-300 cursor-pointer"
                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "font-medium text-sm",
                                    !notification.is_read && "text-indigo-600"
                                  )}>
                                    {notification.title}
                                  </span>
                                  {!notification.is_read && (
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <span className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.created_at).toLocaleDateString('ko-KR')}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 사용자 메뉴 */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
