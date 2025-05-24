
import { useMemo } from "react";
import { Company } from "@/pages/Index";
import { ChartContainer } from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface TimelineChartProps {
  companies: Company[];
}

export const TimelineChart = ({ companies }: TimelineChartProps) => {
  // Process data to create timeline
  const chartData = useMemo(() => {
    // Get first and last dates
    const sortedByDate = [...companies].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    if (sortedByDate.length === 0) {
      return [];
    }
    
    // Create a map of dates and counts
    const dateMap = new Map();
    
    // Initialize with cumulative counts
    let pendingCount = 0;
    let appliedCount = 0;
    let aptitudeCount = 0;
    let interviewCount = 0;
    let passedCount = 0;
    let rejectedCount = 0;
    
    // Group by month and year
    companies.forEach(company => {
      const date = new Date(company.createdAt);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!dateMap.has(monthYear)) {
        dateMap.set(monthYear, {
          date: monthYear,
          pending: 0,
          applied: 0,
          aptitude: 0,
          interview: 0,
          passed: 0,
          rejected: 0
        });
      }
      
      const entry = dateMap.get(monthYear);
      
      switch (company.status) {
        case "pending":
          entry.pending++;
          break;
        case "applied":
          entry.applied++;
          break;
        case "aptitude":
          entry.aptitude++;
          break;
        case "interview":
          entry.interview++;
          break;
        case "passed":
          entry.passed++;
          break;
        case "rejected":
          entry.rejected++;
          break;
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => {
      return a.date.localeCompare(b.date);
    }).map((entry, index, arr) => {
      // If not the first entry, add previous counts to make it cumulative
      if (index > 0) {
        const prev = arr[index - 1];
        entry.pending += prev.pending;
        entry.applied += prev.applied;
        entry.aptitude += prev.aptitude;
        entry.interview += prev.interview;
        entry.passed += prev.passed;
        entry.rejected += prev.rejected;
      }
      
      // Add a total count
      entry.total = entry.pending + entry.applied + entry.aptitude + entry.interview + entry.passed + entry.rejected;
      
      // Format date for display
      const [year, month] = entry.date.split('-');
      entry.displayDate = `${year}.${month}`;
      
      return entry;
    });
  }, [companies]);
  
  // Format the tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.filter((p: any) => p.value > 0).map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm flex items-center gap-1.5 my-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span>{entry.name}: <strong>{entry.value}</strong></span>
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full h-full">
      <ChartContainer
        config={{
          total: { color: "#6366f1" },
          pending: { color: "#9ca3af" },
          applied: { color: "#0ea5e9" },
          aptitude: { color: "#8b5cf6" },
          interview: { color: "#f59e0b" },
          passed: { color: "#10b981" },
          rejected: { color: "#ef4444" },
        }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 11 }}
              height={30}
              padding={{ left: 10, right: 10 }}
              axisLine={{ stroke: "#e5e5e5" }}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              width={30}
              axisLine={{ stroke: "#e5e5e5" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#6366f1" 
              name="총 지원"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="passed" 
              stroke="#10b981" 
              name="합격"
              dot={{ r: 2, strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="rejected" 
              stroke="#ef4444" 
              name="불합격"
              dot={{ r: 2, strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
