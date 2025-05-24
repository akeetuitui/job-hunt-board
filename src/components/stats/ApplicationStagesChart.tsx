
import { useState } from "react";
import { Company } from "@/pages/Index";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

interface ApplicationStagesChartProps {
  companies: Company[];
}

export const ApplicationStagesChart = ({ companies }: ApplicationStagesChartProps) => {
  const [viewType, setViewType] = useState<'count' | 'percentage'>('count');

  // Prepare data for chart
  const getStatusText = (status: Company["status"]) => {
    const texts: Record<Company["status"], string> = {
      pending: "지원예정",
      applied: "지원완료",
      aptitude: "인적성/역량 검사",
      interview: "면접중", 
      passed: "합격",
      rejected: "불합격"
    };
    return texts[status];
  };

  const statusOrder: Company["status"][] = ["pending", "applied", "aptitude", "interview", "passed", "rejected"];
  
  const statusCounts = statusOrder.map(status => {
    const count = companies.filter(company => company.status === status).length;
    return {
      name: getStatusText(status),
      count,
      percentage: companies.length ? Math.round((count / companies.length) * 100) : 0
    };
  });

  return (
    <div className="w-full h-full">
      <div className="flex justify-end mb-4">
        <div className="flex bg-gray-100 rounded-md p-1">
          <Button
            variant={viewType === 'count' ? 'default' : 'ghost'}
            size="sm"
            className={`text-xs ${viewType === 'count' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setViewType('count')}
          >
            지원 건수
          </Button>
          <Button
            variant={viewType === 'percentage' ? 'default' : 'ghost'}
            size="sm"
            className={`text-xs ${viewType === 'percentage' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setViewType('percentage')}
          >
            백분율
          </Button>
        </div>
      </div>

      <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
        <ChartContainer
          config={{
            line1: { color: "#3b82f6" },
          }}
          className="w-full h-full"
        >
          <ResponsiveContainer>
            <BarChart data={statusCounts} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10 }}
                height={40}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10 }}
                unit={viewType === 'percentage' ? "%" : ""}
                width={30}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <div className="font-medium">{data.name}</div>
                        <div className="text-sm">{data.count}건 ({data.percentage}%)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey={viewType === 'percentage' ? "percentage" : "count"}
                radius={[4, 4, 0, 0]}
                fill="var(--color-line1)"
                fillOpacity={0.9}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
