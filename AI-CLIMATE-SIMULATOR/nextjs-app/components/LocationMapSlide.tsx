"use client";
import { PieChart, Server, Activity, Globe, BarChart2 } from 'lucide-react';

export default function LocationMapSlide() {
  return (
    <div className="w-full h-screen bg-[#0e1a2b] flex flex-row font-sans">
      {/* Left: Servers List */}
      <div className="w-64 p-6 flex flex-col gap-4 bg-[#16213a] border-r border-[#22304a] text-[#b6c9e0]">
        <div className="font-bold text-lg mb-2 flex items-center gap-2"><Server size={20}/> SERVERS</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between"><span>209.124.196.40</span><span className="text-red-400">Overload</span></div>
          <div className="flex justify-between"><span>197.212.56.186</span><span className="text-yellow-400">87%</span></div>
          <div className="flex justify-between"><span>233.195.198.5</span><span className="text-red-400">Overload</span></div>
          <div className="flex justify-between"><span>209.153.151.67</span><span className="text-green-400">12.4%</span></div>
        </div>
      </div>
      {/* Center: Map + Activity */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute left-0 right-0 top-0 mx-auto w-[60%] h-[60%] bg-gradient-to-br from-[#1a2a4a] to-[#0e1a2b] rounded-2xl shadow-2xl border border-[#22304a] flex flex-col items-center justify-center">
          {/* Placeholder for map (replace with real map/chart) */}
          <div className="w-full h-full flex items-center justify-center">
            <Globe size={180} className="text-[#5ecfff] opacity-30"/>
            {/* TODO: Replace with real map and glowing data points */}
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
          <div className="flex flex-col items-center text-[#b6c9e0]">
            <span className="text-lg font-bold">436</span>
            <span className="text-xs">Request / Min</span>
          </div>
          <div className="flex flex-col items-center text-[#b6c9e0]">
            <span className="text-lg font-bold">33%</span>
            <span className="text-xs">Uptime</span>
          </div>
          <div className="flex flex-col items-center text-[#b6c9e0]">
            <span className="text-lg font-bold">29%</span>
            <span className="text-xs">Activity</span>
          </div>
          <div className="flex flex-col items-center text-[#b6c9e0]">
            <span className="text-lg font-bold">24%</span>
            <span className="text-xs">Pending</span>
          </div>
        </div>
      </div>
      {/* Right: Donut, stats, activity */}
      <div className="w-96 p-6 flex flex-col gap-6 bg-[#16213a] border-l border-[#22304a] text-[#b6c9e0]">
        <div className="flex flex-col items-center">
          <div className="font-bold text-xs mb-2">DATA USED</div>
          {/* Placeholder for donut chart */}
          <div className="w-40 h-40 rounded-full border-8 border-[#22304a] flex items-center justify-center relative">
            <PieChart size={120} className="text-[#5ecfff] opacity-30"/>
            {/* TODO: Replace with real donut chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#5ecfff]">34%</span>
              <span className="text-xs text-[#b6c9e0]">Active</span>
            </div>
          </div>
          <div className="flex justify-between w-full mt-2 text-xs">
            <span>27%</span><span>13%</span><span>7%</span><span>6%</span><span>3%</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <div className="font-bold text-xs mb-1">GLOBAL STATISTICS</div>
          <div className="flex gap-8 mb-2">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#5ecfff]">2357</span>
              <span className="text-xs text-[#b6c9e0]">Requests</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#5ecfff]">4922</span>
              <span className="text-xs text-[#b6c9e0]">Lat/Back</span>
            </div>
          </div>
          {/* Placeholder for line chart */}
          <div className="w-full h-16 bg-[#22304a] rounded-lg mt-2 flex items-center justify-center">
            <BarChart2 size={40} className="text-[#5ecfff] opacity-30"/>
            {/* TODO: Replace with real line chart */}
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <div className="font-bold text-xs mb-1">ACTIVITY</div>
          {/* Placeholder for activity chart */}
          <div className="w-full h-16 bg-[#22304a] rounded-lg flex items-center justify-center">
            <Activity size={40} className="text-[#5ecfff] opacity-30"/>
            {/* TODO: Replace with real activity chart */}
          </div>
        </div>
      </div>
    </div>
  );
}
