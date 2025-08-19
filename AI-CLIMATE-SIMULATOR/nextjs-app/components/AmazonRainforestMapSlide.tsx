"use client";
import { PieChart } from 'lucide-react';
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
import { Line, Pie } from 'react-chartjs-2';

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

/**
 * AmazonRainforestMapSlide v2.0.0
 * Modular Amazon rainforest dashboard
 * Updated: 2025-08-19
 */
const co2TrendLabels = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
const co2TrendData = [399.4,404.2,406.5,408.7,411.3,414.2,416.5,418.7,420.5,421.8,423.1];

const landUseLabels = ['Forest','Deforested','Water','Urban'];
const landUseData = [82,12,3,3];
const pieColors = ['#5ecfff', '#ff5ecf', '#5effcf', '#cf5eff'];

export default function AmazonRainforestMapSlide() {
  return (
    <div className="w-full h-screen bg-[#0e1a2b] flex flex-row font-sans">
      {/* Left: Location/Server List */}
      <div className="w-64 p-6 flex flex-col gap-4 bg-[#16213a] border-r border-[#22304a] text-[#b6c9e0]">
        <div className="font-bold text-lg mb-2">Amazon Rainforest</div>
        <div className="text-xs mb-4">Region: South America</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between"><span>Manaus</span><span className="text-green-400">Active</span></div>
          <div className="flex justify-between"><span>Belém</span><span className="text-yellow-400">Unverified</span></div>
          <div className="flex justify-between"><span>Rio Branco</span><span className="text-red-400">Offline</span></div>
          <div className="flex justify-between"><span>Porto Velho</span><span className="text-green-400">Active</span></div>
        </div>
        <div className="mt-8 text-xs text-[#5ecfff]">Total Area: 5.5M km²</div>
        <div className="text-xs text-[#5ecfff]">CO₂ Absorption: 2B tons/yr</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute left-0 right-0 top-0 mx-auto w-[60%] h-[60%] bg-gradient-to-br from-[#1a2a4a] to-[#0e1a2b] rounded-2xl shadow-2xl border border-[#22304a] flex flex-col items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 300" width="90%" height="90%" className="rounded-xl">
              <ellipse cx="200" cy="150" rx="120" ry="80" fill="#5ecfff22" stroke="#5ecfff" strokeWidth="4" />
              <circle cx="170" cy="120" r="7" fill="#22c55e" />
              <circle cx="250" cy="180" r="7" fill="#fde047" />
              <circle cx="120" cy="200" r="7" fill="#ef4444" />
              <circle cx="210" cy="100" r="7" fill="#22c55e" />
            </svg>
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[60%] bg-[#16213a] rounded-xl shadow-lg p-4 border border-[#22304a]">
          <div className="text-xs text-[#b6c9e0] mb-1">CO₂ Concentration Trend (ppm)</div>
          <Line
            data={{
              labels: co2TrendLabels,
              datasets: [
                {
                  label: 'CO₂ (ppm)',
                  data: co2TrendData,
                  borderColor: '#5ecfff',
                  backgroundColor: 'rgba(94,207,255,0.2)',
                  tension: 0.4,
                  pointRadius: 4,
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
                x: { ticks: { color: '#bfc9d8' }, grid: { color: '#39344a' } },
                y: { ticks: { color: '#5ecfff' }, grid: { color: '#39344a' } },
              },
            }}
          />
        </div>
      </div>
      <div className="w-96 p-6 flex flex-col gap-6 bg-[#16213a] border-l border-[#22304a] text-[#b6c9e0]">
        <div className="flex flex-col items-center mb-4">
          <div className="font-bold text-xs mb-2">LAND USE DISTRIBUTION</div>
          <div className="w-40 h-40 rounded-full border-8 border-[#22304a] flex items-center justify-center relative">
            <Pie
              data={{
                labels: landUseLabels,
                datasets: [
                  {
                    data: landUseData,
                    backgroundColor: pieColors,
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
              // sizing handled by container
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#5ecfff]">{landUseData[0]}%</span>
              <span className="text-xs text-[#b6c9e0]">Forest</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between"><span>Annual Rainfall</span><span className="text-[#5ecfff]">2,300 mm</span></div>
          <div className="flex justify-between"><span>Avg Temp</span><span className="text-[#5ecfff]">26°C</span></div>
          <div className="flex justify-between"><span>CO₂ Absorption</span><span className="text-[#5ecfff]">2B tons/yr</span></div>
          <div className="flex justify-between"><span>Deforestation Rate</span><span className="text-[#ff5ecf]">0.6%/yr</span></div>
        </div>
        <div className="mt-6 text-xs text-[#bfc9d8] text-center">
          Data reflects current Amazon rainforest status and trends in CO₂ concentration.
        </div>
      </div>
    </div>
  );
}
