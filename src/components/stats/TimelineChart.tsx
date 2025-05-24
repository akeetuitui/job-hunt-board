
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
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <p className="label">{label}</p>
          {payload.filter((p: any) => p.value > 0).map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
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
          applied: { color: "#3b82f6" },
          aptitude: { color: "#a855f7" },
          interview: { color: "#eab308" },
          passed: { color: "#22c55e" },
          rejected: { color: "#ef4444" },
        }}
        className="w-full h-full"
      >
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              height={30}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#6366f1" 
              name="총 지원"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="passed" 
              stroke="#22c55e" 
              name="합격"
              dot={{ r: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="rejected" 
              stroke="#ef4444" 
              name="불합격"
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
