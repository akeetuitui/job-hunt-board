
import { useState } from "react";
import { Company } from "@/pages/Index";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";

interface ApplicationStagesChartProps {
  companies: Company[];
}

export const ApplicationStagesChart = ({ companies }: ApplicationStagesChartProps) => {
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
  
  const statusCounts = statusOrder.map((status, index) => {
    const count = companies.filter(company => company.status === status).length;
    return {
      name: getStatusText(status),
      count,
      percentage: companies.length ? Math.round((count / companies.length) * 100) : 0,
      index: index + 1
    };
  });

  // Custom label component to show values on top of bars
  const renderCustomLabel = (props: any) => {
    const { x, y, width, value, payload } = props;
    
    // Safety check: return null if payload is undefined or doesn't have the required properties
    if (!payload || (payload.count === undefined && payload.percentage === undefined)) {
      return null;
    }
    
    const centerX = x + width / 2;
    
    return (
      <g>
        {/* Index number */}
        <text 
          x={centerX} 
          y={y - 25} 
          fill="#6b7280" 
          textAnchor="middle" 
          fontSize="10" 
          fontWeight="600"
        >
          #{payload.index}
        </text>
        {/* Count and percentage */}
        <text 
          x={centerX} 
          y={y - 8} 
          fill="#374151" 
          textAnchor="middle" 
          fontSize="11" 
          fontWeight="600"
        >
          {payload.count}건
        </text>
        <text 
          x={centerX} 
          y={y + 5} 
          fill="#6b7280" 
          textAnchor="middle" 
          fontSize="10" 
          fontWeight="500"
        >
          ({payload.percentage}%)
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ChartContainer
          config={{
            line1: { color: "#14b8a6" },
          }}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusCounts} margin={{ top: 35, right: 0, left: -20, bottom: 5 }}>
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
                width={30}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-md">
                        <div className="font-medium">#{data.index} {data.name}</div>
                        <div className="text-sm">{data.count}건 ({data.percentage}%)</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="count"
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
