
import { useState } from "react";
import { Company } from "@/pages/Index";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
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
      aptitude: "인적성/역량",
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

  // Custom label component to show values on top of bars
  const renderCustomLabel = (props: any) => {
    const { x, y, width, value, payload } = props;
    const displayValue = viewType === 'percentage' ? `${payload.percentage}%` : payload.count;
    const centerX = x + width / 2;
    
    return (
      <text 
        x={centerX} 
        y={y - 5} 
        fill="#374151" 
        textAnchor="middle" 
        fontSize="11" 
        fontWeight="500"
      >
        {displayValue}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end mb-3">
        <div className="inline-flex bg-gray-50 rounded-lg p-1 shadow-sm">
          <Button
            variant={viewType === 'count' ? 'default' : 'ghost'}
            size="sm"
            className={`text-xs rounded-md ${viewType === 'count' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'}`}
            onClick={() => setViewType('count')}
          >
            지원 건수
          </Button>
          <Button
            variant={viewType === 'percentage' ? 'default' : 'ghost'}
            size="sm"
            className={`text-xs rounded-md ${viewType === 'percentage' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'}`}
            onClick={() => setViewType('percentage')}
          >
            백분율
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChartContainer
          config={{
            line1: { color: "#14b8a6" },
          }}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusCounts} margin={{ top: 25, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10 }}
                height={35}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10 }}
                unit={viewType === 'percentage' ? "%" : ""}
                width={30}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-md">
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
                fill="#14b8a6"
                fillOpacity={0.9}
                barSize={26}
                label={renderCustomLabel}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
