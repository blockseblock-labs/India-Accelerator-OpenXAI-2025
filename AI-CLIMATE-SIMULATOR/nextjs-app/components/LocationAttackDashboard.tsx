"use client";
import { PieChart, Server, Activity } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import AmazonMap from './AmazonMap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartTooltip,
  ChartLegend,
  Title
);


// Environmental metrics for Amazon (example values)
const envMetrics = [
  { label: 'CO₂ (ppm)', value: 423, color: '#5ecfff' },
  { label: 'Rainfall (mm)', value: 2300, color: '#22c55e' },
  { label: 'Avg Temp (°C)', value: 26, color: '#fde047' },
  { label: 'Deforestation (%)', value: 12, color: '#ff5ecf' },
];

const donutLabels = ['Forest','Deforested','Water','Urban'];
const donutData = [82,12,3,3];
const donutColors = ['#5ecfff', '#ff5ecf', '#5effcf', '#cf5eff'];

const globalStats = [
  { label: 'CO₂ Absorption', value: '2B tons/yr' },
  { label: 'Total Area', value: '5.5M km²' },
];

const activityTrendLabels = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
const activityTrendData = [399.4,404.2,406.5,408.7,411.3,414.2,416.5,418.7,420.5,421.8,423.1];

export default function LocationAttackDashboard() {
  return (
    <div className="w-full h-screen bg-[#0e1a2b] flex flex-row font-sans">
      {/* Left: Servers/Nodes List */}
      <div className="w-64 p-6 flex flex-col gap-4 bg-[#16213a] border-r border-[#22304a] text-[#b6c9e0]">
        <div className="font-bold text-lg mb-2 flex items-center gap-2"><Server size={20}/> NODES</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between"><span>192.168.1.10</span><span className="text-red-400">Breached</span></div>
          <div className="flex justify-between"><span>192.168.1.12</span><span className="text-yellow-400">Under Attack</span></div>
          <div className="flex justify-between"><span>192.168.1.15</span><span className="text-green-400">Secure</span></div>
          <div className="flex justify-between"><span>192.168.1.18</span><span className="text-green-400">Secure</span></div>
        </div>
        <div className="mt-8 text-xs text-[#5ecfff]">Total Nodes: 4</div>
        <div className="text-xs text-[#5ecfff]">Active Attacks: 2</div>
      </div>
      {/* Center: Map + Environmental Metrics */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute left-0 right-0 top-0 mx-auto w-[60%] h-[60%] bg-gradient-to-br from-[#1a2a4a] to-[#0e1a2b] rounded-2xl shadow-2xl border border-[#22304a] flex flex-col items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <AmazonMap width={380} height={260} />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="text-xs text-[#b6c9e0]">Offline</div>
            <div className="w-3 h-3 bg-red-400 rounded-full"/>
            <div className="text-xs text-[#b6c9e0] ml-4">Active</div>
            <div className="w-3 h-3 bg-green-400 rounded-full"/>
            <div className="text-xs text-[#b6c9e0] ml-4">Unverified</div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"/>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8">
          {envMetrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center text-[#b6c9e0]">
              <span className="text-lg font-bold" style={{color: m.color}}>{m.value}</span>
              <span className="text-xs">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Right: Donut, stats, activity */}
      <div className="w-96 p-6 flex flex-col gap-6 bg-[#16213a] border-l border-[#22304a] text-[#b6c9e0]">
        <div className="flex flex-col items-center">
          <div className="font-bold text-xs mb-2">LAND USE DISTRIBUTION</div>
          <div className="w-40 h-40 rounded-full border-8 border-[#22304a] flex items-center justify-center relative">
            <Pie
              data={{
                labels: donutLabels,
                datasets: [
                  {
                    data: donutData,
                    backgroundColor: donutColors,
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#5ecfff]">{donutData[0]}%</span>
              <span className="text-xs text-[#b6c9e0]">Forest</span>
            </div>
          </div>
          <div className="flex justify-between w-full mt-2 text-xs">
            {donutData.map((v, i) => (
              <span key={i}>{v}%</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <div className="font-bold text-xs mb-1">GLOBAL STATISTICS</div>
          <div className="flex gap-8 mb-2">
            {globalStats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#5ecfff]">{stat.value}</span>
                <span className="text-xs text-[#b6c9e0]">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-16 bg-[#22304a] rounded-lg mt-2 flex items-center justify-center">
            <Line
              data={{
                labels: activityTrendLabels,
                datasets: [
                  {
                    label: 'CO₂ (ppm)',
                    data: activityTrendData,
                    borderColor: '#5ecfff',
                    backgroundColor: 'rgba(94,207,255,0.2)',
                    tension: 0.4,
                    pointRadius: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                scales: {
                  x: { ticks: { color: '#bfc9d8', font: {size: 10} }, grid: { color: '#39344a' } },
                  y: { ticks: { color: '#5ecfff', font: {size: 10} }, grid: { color: '#39344a' } },
                },
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <div className="font-bold text-xs mb-1">ACTIVITY</div>
          <div className="w-full h-16 bg-[#22304a] rounded-lg flex items-center justify-center">
            <Activity size={40} className="text-[#5ecfff] opacity-30"/>
            {/* TODO: Replace with real activity chart if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
