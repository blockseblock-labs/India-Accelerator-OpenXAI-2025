"use client";
import { User, BarChart2, PieChart, Globe, Search, Mail, Bell, Layers, Users, Settings } from 'lucide-react';

export default function AnalyticsDashboardSlide() {
  return (
    <div className="w-full h-screen bg-[#23202b] flex flex-row font-sans">
      {/* Sidebar */}
      <div className="w-56 bg-[#2c2937] border-r border-[#39344a] flex flex-col pt-8 text-[#bfc9d8]">
        <div className="flex flex-col gap-2 px-6 mb-8">
          <span className="text-xs tracking-widest text-[#6c7a89]">DIAMOND</span>
          <span className="text-lg font-bold text-[#5ecfff]">Balance: <span className="text-white">5,367.50 $</span></span>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-2">
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#232b3a] text-[#5ecfff]"><BarChart2 size={20}/> Dashboard</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><PieChart size={20}/> Statistics</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><Search size={20}/> Search</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><Users size={20}/> Leaders</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><Layers size={20}/> Trade</button>
          <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#232b3a]"><Settings size={20}/> Support</button>
        </nav>
        <div className="mt-auto px-6 pb-6 flex flex-col gap-2">
          <button className="flex items-center gap-2 text-xs text-[#6c7a89] hover:text-[#5ecfff]">
            <User size={16}/> My profile
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Topbar */}
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
        {/* Analytics grid */}
        <main className="flex-1 bg-[#23202b] p-6 grid grid-cols-6 grid-rows-6 gap-4">
          {/* Main line chart */}
          <div className="col-span-3 row-span-3 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="text-white font-bold text-lg mb-2">Analytics</div>
            {/* TODO: Replace with real multi-line chart */}
            <div className="flex-1 flex items-center justify-center">
              <BarChart2 size={120} className="text-[#5ecfff] opacity-30"/>
            </div>
          </div>
          {/* Radar chart + donut stats */}
          <div className="col-span-1 row-span-3 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center">
            {/* TODO: Replace with real radar chart */}
            <div className="w-40 h-40 flex items-center justify-center">
              <Globe size={100} className="text-[#5ecfff] opacity-30"/>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-[#5ecfff] font-bold text-lg">64%</span>
                <span className="text-xs text-[#bfc9d8]">A</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#5ecfff] font-bold text-lg">76%</span>
                <span className="text-xs text-[#bfc9d8]">B</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#5ecfff] font-bold text-lg">58%</span>
                <span className="text-xs text-[#bfc9d8]">C</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#5ecfff] font-bold text-lg">62%</span>
                <span className="text-xs text-[#bfc9d8]">D</span>
              </div>
            </div>
          </div>
          {/* Donut + stat */}
          <div className="col-span-1 row-span-1 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
            {/* TODO: Replace with real donut chart */}
            <PieChart size={60} className="text-[#5ecfff] opacity-30"/>
            <div className="text-[#5ecfff] font-bold text-2xl mt-2">5.435024</div>
          </div>
          {/* World map */}
          <div className="col-span-2 row-span-2 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="text-white font-bold text-sm mb-2">Support Service</div>
            {/* TODO: Replace with real world map */}
            <div className="flex-1 flex items-center justify-center">
              <Globe size={80} className="text-[#5ecfff] opacity-30"/>
            </div>
          </div>
          {/* Pie/donut chart */}
          <div className="col-span-1 row-span-2 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
            {/* TODO: Replace with real pie/donut chart */}
            <PieChart size={60} className="text-[#5ecfff] opacity-30"/>
            <div className="text-[#5ecfff] font-bold text-lg mt-2">561</div>
          </div>
          {/* Bar chart */}
          <div className="col-span-1 row-span-2 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
            {/* TODO: Replace with real bar chart */}
            <BarChart2 size={60} className="text-[#5ecfff] opacity-30"/>
          </div>
          {/* Stat lines */}
          <div className="col-span-2 row-span-2 bg-[#191825] rounded-2xl shadow-lg p-6 flex flex-col gap-2">
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#5ecfff]"/>
                <div className="flex-1 h-2 rounded bg-gradient-to-r from-[#5ecfff] to-[#bfc9d8] opacity-60"/>
                <span className="text-[#bfc9d8] text-xs ml-2">01</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#ff5ecf]"/>
                <div className="flex-1 h-2 rounded bg-gradient-to-r from-[#ff5ecf] to-[#bfc9d8] opacity-60"/>
                <span className="text-[#bfc9d8] text-xs ml-2">02</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#5effcf]"/>
                <div className="flex-1 h-2 rounded bg-gradient-to-r from-[#5effcf] to-[#bfc9d8] opacity-60"/>
                <span className="text-[#bfc9d8] text-xs ml-2">03</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#cf5eff]"/>
                <div className="flex-1 h-2 rounded bg-gradient-to-r from-[#cf5eff] to-[#bfc9d8] opacity-60"/>
                <span className="text-[#bfc9d8] text-xs ml-2">04</span>
              </div>
            </div>
          </div>
        </main>
        {/* Footer time */}
        <div className="w-full text-right text-xs text-[#bfc9d8] px-8 pb-2">Current time: 24 November 2018, 12:35:43</div>
      </div>
    </div>
  );
}
