
import { Company } from "@/pages/Index";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SuccessRateChartProps {
  companies: Company[];
}

export const SuccessRateChart = ({ companies }: SuccessRateChartProps) => {
  // Filter companies that have reached a final decision (passed or rejected)
  const decidedCompanies = companies.filter(c => c.status === "passed" || c.status === "rejected");
  const passedCount = companies.filter(c => c.status === "passed").length;
  const rejectedCount = companies.filter(c => c.status === "rejected").length;
  const pendingCount = companies.length - passedCount - rejectedCount;

  const data = [
    { name: '합격', value: passedCount, color: '#22c55e' },
    { name: '불합격', value: rejectedCount, color: '#ef4444' },
    { name: '진행중', value: pendingCount, color: '#9ca3af' }
  ].filter(item => item.value > 0);

  const successRate = decidedCompanies.length ? 
    Math.round((passedCount / decidedCompanies.length) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-2">
        <p className="text-gray-500 text-sm font-medium">최종 결정이 난 지원서 성공률</p>
        <h3 className="text-3xl font-bold text-teal-600">{successRate}%</h3>
      </div>

      <div className="flex-1 min-h-0">
        <ChartContainer
          config={{
            passed: { color: "#10b981" },
            rejected: { color: "#ef4444" },
            pending: { color: "#9ca3af" },
          }}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                innerRadius={40}
                dataKey="value"
                strokeWidth={1}
                stroke="#fff"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="drop-shadow-sm"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percent = Math.round(
                      (data.value / companies.length) * 100
                    );
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-md">
                        <div className="font-medium">{data.name}</div>
                        <div className="text-sm">
                          {data.value}건 ({percent}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
