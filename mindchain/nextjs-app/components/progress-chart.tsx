"use client"

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "@/components/ui/chart"

const data = [
  {
    subject: "Anxiety Management",
    week1: 20,
    week2: 30,
    week3: 45,
    week4: 65,
    fullMark: 100,
  },
  {
    subject: "Mood Stability",
    week1: 30,
    week2: 40,
    week3: 55,
    week4: 70,
    fullMark: 100,
  },
  {
    subject: "Sleep Quality",
    week1: 25,
    week2: 35,
    week3: 50,
    week4: 60,
    fullMark: 100,
  },
  {
    subject: "Social Engagement",
    week1: 40,
    week2: 45,
    week3: 60,
    week4: 75,
    fullMark: 100,
  },
  {
    subject: "Mindfulness",
    week1: 15,
    week2: 25,
    week3: 40,
    week4: 60,
    fullMark: 100,
  },
]

export function ProgressChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--foreground)", fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Week 1" dataKey="week1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
        <Radar name="Week 2" dataKey="week2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
        <Radar name="Week 3" dataKey="week3" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
        <Radar name="Week 4" dataKey="week4" stroke="#ff8042" fill="#ff8042" fillOpacity={0.2} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}

