"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";

interface DataPoint {
  date: string;
  mood: number;
  anxiety: number;
  sleep: number;
}

interface TooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const data: DataPoint[] = [
  { date: "Day 1", mood: 3, anxiety: 7, sleep: 4 },
  { date: "Day 2", mood: 4, anxiety: 6, sleep: 5 },
  { date: "Day 3", mood: 3, anxiety: 7, sleep: 3 },
  { date: "Day 4", mood: 5, anxiety: 5, sleep: 6 },
  { date: "Day 5", mood: 6, anxiety: 4, sleep: 7 },
  { date: "Day 6", mood: 5, anxiety: 5, sleep: 6 },
  { date: "Day 7", mood: 7, anxiety: 3, sleep: 8 },
  { date: "Day 8", mood: 6, anxiety: 4, sleep: 7 },
  { date: "Day 9", mood: 7, anxiety: 3, sleep: 7 },
  { date: "Day 10", mood: 8, anxiety: 2, sleep: 8 },
  { date: "Day 11", mood: 7, anxiety: 3, sleep: 7 },
  { date: "Day 12", mood: 8, anxiety: 2, sleep: 8 },
  { date: "Day 13", mood: 7, anxiety: 3, sleep: 7 },
  { date: "Day 14", mood: 8, anxiety: 2, sleep: 8 },
];

export function MoodChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          label={{ value: "Date", position: "bottom" }}
        />
        <YAxis
          domain={[0, 10]}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          label={{
            value: "Rating (0-10)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip
          content={({ active, payload, label }: TooltipContentProps) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 border shadow-sm bg-background">
                  <p className="font-medium">{label}</p>
                  {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color }}>
                      {entry.name}: {entry.value}
                    </p>
                  ))}
                </Card>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="mood"
          name="Mood"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="anxiety"
          name="Anxiety"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="sleep"
          name="Sleep Quality"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
