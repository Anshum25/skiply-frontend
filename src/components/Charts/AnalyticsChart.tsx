import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  type: "line" | "area" | "bar" | "pie";
  height?: number;
  color?: string;
  gradientColors?: [string, string];
  showTrend?: boolean;
  trendValue?: number;
  className?: string;
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showGrid?: boolean;
  animated?: boolean;
}

const CHART_COLORS = [
  "hsl(262.1, 83.3%, 57.8%)", // Primary purple
  "hsl(217.2, 91.2%, 59.8%)", // Blue
  "hsl(328.6, 85.5%, 70.2%)", // Pink
  "hsl(142.1, 76.2%, 36.3%)", // Green
  "hsl(24.6, 95%, 53.1%)", // Orange
  "hsl(173.4, 66.1%, 47.8%)", // Teal
];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  description,
  data,
  type,
  height = 300,
  color = CHART_COLORS[0],
  gradientColors = [color, `${color}33`],
  showTrend = false,
  trendValue,
  className,
  valueFormatter = (value) => value.toString(),
  showLegend = false,
  showGrid = true,
  animated = true,
}) => {
  const getChartIcon = () => {
    switch (type) {
      case "line":
        return <LineChartIcon className="w-4 h-4" />;
      case "area":
        return <Activity className="w-4 h-4" />;
      case "bar":
        return <BarChart3 className="w-4 h-4" />;
      case "pie":
        return <PieChartIcon className="w-4 h-4" />;
    }
  };

  const getTrendIcon = () => {
    if (!showTrend || trendValue === undefined) return null;

    if (trendValue > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trendValue < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (!trendValue) return "";
    return trendValue > 0 ? "text-green-500" : "text-red-500";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {valueFormatter(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      height,
      className: animated ? "animate-fade-in" : "",
    };

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              )}
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={valueFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                animationDuration={animated ? 1000 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={gradientColors[0]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={gradientColors[1]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              )}
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={valueFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGradient)"
                animationDuration={animated ? 1000 : 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              )}
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={valueFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar
                dataKey="value"
                fill={color}
                radius={[4, 4, 0, 0]}
                animationDuration={animated ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={height / 3}
                innerRadius={height / 6}
                paddingAngle={2}
                animationDuration={animated ? 1000 : 0}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                formatter={(value) => [valueFormatter(Number(value)), ""]}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("glass-strong border-0", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getChartIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>

          {showTrend && trendValue !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <Badge
                variant="outline"
                className={cn("text-xs", getTrendColor())}
              >
                {trendValue > 0 ? "+" : ""}
                {trendValue.toFixed(1)}%
              </Badge>
            </div>
          )}
        </div>

        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="pb-6">{renderChart()}</CardContent>
    </Card>
  );
};
