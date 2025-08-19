"use client";
import { User, Search, Mail, Bell, Layers, Users, Settings, BarChart2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  ChartTooltip,
  ChartLegend,
  Title
);

/**
 * ChartDashboardSlide v2.0.0
 * Modular dashboard for CO2 and Amazon analytics
 * Updated: 2025-08-19
 */
const co2TrendLabels = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
const co2TrendData = [399.4,404.2,406.5,408.7,411.3,414.2,416.5,418.7,420.5,421.8,423.1];

const radarLabels = ['Rainfall','Humidity','Tree Cover','Biodiversity','CO₂ Absorption'];
const radarData = [92,85,78,88,95];

const pieLabels = ['Forest','Deforested','Water','Urban'];
const pieData = [82,12,3,3];
const pieColors = ['#5ecfff', '#ff5ecf', '#5effcf', '#cf5eff'];

const barLabels = ['Energy','Industry','Transport','Agriculture'];
const barData = [36,9,8,6];

const areaLabels = [2022,2023,2024,2025];
const areaData = [2100,2080,2050,2020];

export default function ChartDashboardSlide() {
  return (
    <div className="w-full h-screen bg-[#23202b] flex flex-row font-sans">
      <div className="w-56 bg-[#2c2937] border-r border-[#39344a] flex flex-col pt-8 text-[#bfc9d8]">
        <div className="flex flex-col gap-2 px-6 mb-8">
          <span className="text-xs tracking-widest text-[#6c7a89]">DIAMOND</span>
          <span className="text-lg font-bold text-[#5ecfff]">Balance: <span className="text-white">5,367.50 $</span></span>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-2">
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#232b3a] text-[#5ecfff]"><Layers size={20}/> Dashboard</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><BarChart2 size={20}/> Statistics</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><Search size={20}/> Search</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><Users size={20}/> Leaders</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><Settings size={20}/> Trade</button>
        </nav>
        <div className="mt-auto px-6 pb-6 flex flex-col gap-2">
          <button className="flex items-center gap-2 text-xs text-[#6c7a89] hover:text-[#5ecfff]">
            <User size={16}/> My profile
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full">
        <div className="h-16 bg-[#23202b] border-b border-[#39344a] flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#5ecfff] font-bold text-xl tracking-widest">Dashboard</span>
            <span className="ml-8 text-[#bfc9d8] text-sm">Analytics</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#23202b] px-3 py-1 rounded-full border border-[#39344a]">
              <Search size={16} className="text-[#5ecfff]"/>
              <input className="bg-transparent outline-none text-xs text-[#bfc9d8] w-32" placeholder="Search" />
            </div>
            <Bell size={20} className="text-[#5ecfff] cursor-pointer"/>
            <Mail size={20} className="text-[#5ecfff] cursor-pointer"/>
            <div className="w-8 h-8 rounded-full bg-[#5ecfff] flex items-center justify-center text-white font-bold cursor-pointer">
              <User size={18}/>
            </div>
          </div>
        </div>
        <main className="flex-1 bg-[#23202b] p-6 grid grid-cols-6 grid-rows-6 gap-4">
          <div className="col-span-3 row-span-3 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col aspect-video">
            <div className="text-white font-bold text-lg mb-2">Earth CO₂ Concentration (ppm)</div>
            <div className="flex-1 flex items-center justify-center">
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
                    legend: { display: true, labels: { color: '#bfc9d8' } },
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
          <div className="col-span-1 row-span-3 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-40 h-40 flex items-center justify-center">
              <Radar
                data={{
                  labels: radarLabels,
                  datasets: [
                    {
                      label: 'Metric',
                      data: radarData,
                      backgroundColor: 'rgba(94,207,255,0.3)',
                      borderColor: '#5ecfff',
                      borderWidth: 2,
                      pointBackgroundColor: '#5ecfff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    r: {
                      angleLines: { color: '#39344a' },
                      grid: { color: '#39344a' },
                      pointLabels: { color: '#bfc9d8', font: { size: 12 } },
                      ticks: { color: '#5ecfff', stepSize: 20, backdropColor: 'transparent' },
                      min: 0,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
            <div className="flex gap-2 mt-4">
              {radarLabels.map((label, i) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-[#5ecfff] font-bold text-lg">{radarData[i]}%</span>
                  <span className="text-xs text-[#bfc9d8]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 row-span-1 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
            <Pie
              data={{
                labels: pieLabels,
                datasets: [
                  {
                    data: pieData,
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
            />
            <div className="text-[#5ecfff] font-bold text-2xl mt-2">{pieData[0]}% Forest</div>
          </div>
          <div className="col-span-1 row-span-2 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
            <Pie
              data={{
                labels: barLabels,
                datasets: [
                  {
                    data: barData,
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
            />
            <div className="text-[#5ecfff] font-bold text-lg mt-2">{barData.reduce((a, b) => a + b, 0)} GtCO₂/yr</div>
          </div>
          <div className="col-span-1 row-span-2 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
            <Bar
              data={{
                labels: barLabels,
                datasets: [
                  {
                    label: 'CO₂ Emissions',
                    data: barData,
                    backgroundColor: pieColors,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { ticks: { color: '#bfc9d8' }, grid: { color: '#39344a' } },
                  y: { ticks: { color: '#5ecfff' }, grid: { color: '#39344a' } },
                },
              }}
            />
          </div>
          <div className="col-span-2 row-span-2 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
            <Line
              data={{
                labels: areaLabels,
                datasets: [
                  {
                    label: 'CO₂ Absorption (MtCO₂/yr)',
                    data: areaData,
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
                },
                scales: {
                  x: { ticks: { color: '#bfc9d8' }, grid: { color: '#39344a' } },
                  y: { ticks: { color: '#5ecfff' }, grid: { color: '#39344a' } },
                },
              }}
            />
          </div>
        </main>
        <div className="w-full text-right text-xs text-[#bfc9d8] px-8 pb-2">Current time: 24 November 2018, 12:35:43</div>
      </div>
    </div>
  );
}
