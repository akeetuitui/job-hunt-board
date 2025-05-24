
import { Building2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">JobTracker</h1>
              <p className="text-sm text-gray-500">취업 지원현황 관리 시스템</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
