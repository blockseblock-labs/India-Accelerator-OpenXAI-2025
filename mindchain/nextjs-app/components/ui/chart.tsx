import type React from "react"

export const ResponsiveContainer = ({
  children,
  width,
  height,
}: { children: React.ReactNode; width: string; height: string }) => {
  return <div style={{ width: width, height: height }}>{children}</div>
}

export const LineChart = ({ data, margin, children }: { data: any[]; margin: any; children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const Line = ({
  type,
  dataKey,
  stroke,
  strokeWidth,
  dot,
  activeDot,
  name,
}: { type: string; dataKey: string; stroke: string; strokeWidth: number; dot: any; activeDot: any; name: string }) => {
  return <div></div>
}

export const XAxis = ({ dataKey, tick, label }: { dataKey: string; tick: any; label: any }) => {
  return <div></div>
}

export const YAxis = ({
  domain,
  tick,
  tickMargin,
  label,
}: { domain: number[]; tick: any; tickMargin: number; label: any }) => {
  return <div></div>
}

export const CartesianGrid = ({ strokeDasharray, opacity }: { strokeDasharray: string; opacity: number }) => {
  return <div></div>
}

export const Tooltip = ({ content }: { content: any }) => {
  return <div></div>
}

export const Legend = () => {
  return <div></div>
}

export const RadarChart = ({
  cx,
  cy,
  outerRadius,
  data,
  children,
}: { cx: string; cy: string; outerRadius: string; data: any[]; children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const PolarGrid = () => {
  return <div></div>
}

export const PolarAngleAxis = ({ dataKey, tick }: { dataKey: string; tick: any }) => {
  return <div></div>
}

export const PolarRadiusAxis = ({ angle, domain }: { angle: number; domain: number[] }) => {
  return <div></div>
}

export const Radar = ({
  name,
  dataKey,
  stroke,
  fill,
  fillOpacity,
}: { name: string; dataKey: string; stroke: string; fill: string; fillOpacity: number }) => {
  return <div></div>
}

