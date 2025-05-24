
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
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
    {
      title: "서류합격률",
      value: `${documentPassRate}%`,
      icon: FileCheck,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "최종합격률",
      value: `${finalPassRate}%`,
      icon: CheckCircle2,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-gray-100 shadow-sm hover:shadow transition-shadow">
          <CardContent className="pt-6 px-4 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
