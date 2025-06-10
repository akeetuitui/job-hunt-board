
import { Company } from "@/pages/Index";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Briefcase, 
  CheckCircle2, 
  FileCheck
} from "lucide-react";

interface StatsOverviewProps {
  companies: Company[];
}

export const StatsOverview = ({ companies }: StatsOverviewProps) => {
  // Calculate statistics
  const totalApplications = companies.length;
  
  // Document pass rate: companies that have reached aptitude/interview/passed stages
  const documentsPassedApplications = companies.filter(c => 
    ["aptitude", "interview", "passed"].includes(c.status)).length;
  
  // Calculate only applications that have completed the document stage (not pending or applied)
  const pastDocumentStage = companies.filter(c => 
    !["pending", "applied"].includes(c.status)).length;
  
  // Final pass rate
  const successfulApplications = companies.filter(c => c.status === "passed").length;
  const completedApplications = companies.filter(c => 
    ["passed", "rejected"].includes(c.status)).length;
  
  const documentPassRate = pastDocumentStage ? 
    Math.round((documentsPassedApplications / pastDocumentStage) * 100) || 0 : 0;
  
  const finalPassRate = completedApplications ? 
    Math.round((successfulApplications / completedApplications) * 100) || 0 : 0;
  
  const stats = [
    {
      title: "총 지원건수",
      value: totalApplications,
      icon: Briefcase,
      color: "text-slate-700",
      bgColor: "bg-gradient-to-br from-slate-100/80 to-slate-200/60",
      borderColor: "border-slate-200/50",
      iconBg: "bg-gradient-to-br from-slate-500 to-slate-600"
    },
    {
      title: "서류합격률",
      value: `${documentPassRate}%`,
      icon: FileCheck,
      color: "text-indigo-700",
      bgColor: "bg-gradient-to-br from-indigo-100/80 to-blue-200/60",
      borderColor: "border-indigo-200/50",
      iconBg: "bg-gradient-to-br from-indigo-500 to-blue-600"
    },
    {
      title: "최종합격률",
      value: `${finalPassRate}%`,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bgColor: "bg-gradient-to-br from-emerald-100/80 to-green-200/60",
      borderColor: "border-emerald-200/50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className={`border ${stat.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/60 backdrop-blur-sm hover:scale-105 transform`}
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl shadow-lg ${stat.iconBg}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
