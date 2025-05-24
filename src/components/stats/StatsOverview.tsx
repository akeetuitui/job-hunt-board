
import { Company } from "@/pages/Index";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  FileX2, 
  Briefcase, 
  PieChart 
} from "lucide-react";

interface StatsOverviewProps {
  companies: Company[];
}

export const StatsOverview = ({ companies }: StatsOverviewProps) => {
  // Calculate statistics
  const totalApplications = companies.length;
  const pendingApplications = companies.filter(c => c.status === "pending").length;
  const activeApplications = companies.filter(c => !["pending", "passed", "rejected"].includes(c.status)).length;
  const successfulApplications = companies.filter(c => c.status === "passed").length;
  const rejectedApplications = companies.filter(c => c.status === "rejected").length;
  
  const successRate = totalApplications ? 
    Math.round((successfulApplications / (successfulApplications + rejectedApplications)) * 100) || 0 : 0;
  
  const stats = [
    {
      title: "총 지원건수",
      value: totalApplications,
      icon: Briefcase,
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    },
    {
      title: "지원 예정",
      value: pendingApplications,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "진행 중",
      value: activeApplications,
      icon: BarChart3,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      title: "합격",
      value: successfulApplications,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "불합격",
      value: rejectedApplications,
      icon: FileX2,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      title: "합격률",
      value: `${successRate}%`,
      icon: PieChart,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
