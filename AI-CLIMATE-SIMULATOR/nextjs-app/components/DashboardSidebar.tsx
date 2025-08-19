"use client";
import { BarChart2, User, Search, Users, PieChart, Globe, DollarSign, Layers, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardSidebar({ active = "Dashboard" }) {
  return (
    <aside className="h-full w-56 bg-[#23232b] border-r border-[#33334a] flex flex-col pt-8 text-[#bfc9d8] font-sans">
      <div className="flex flex-col gap-2 px-6 mb-8">
        <span className="text-xs tracking-widest text-[#6c7a89]">DIAMOND</span>
        <span className="text-lg font-bold text-[#5ecfff]">Balance: <span className="text-white">5,367.50 $</span></span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-2">
        <Link href="#" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${active === "Dashboard" ? "bg-[#2e2e3a] text-[#5ecfff]" : "hover:bg-[#2e2e3a]"}`}><BarChart2 size={20}/> Dashboard</Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2e2e3a]"><PieChart size={20}/> Statistics</Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2e2e3a]"><Search size={20}/> Search</Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2e2e3a]"><Users size={20}/> Leaders</Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2e2e3a]"><DollarSign size={20}/> Trade</Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2e2e3a]"><Layers size={20}/> Support</Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#2e2e3a]"><Settings size={20}/> Settings</Link>
      </nav>
      <div className="mt-auto px-6 pb-6 flex flex-col gap-2">
        <button className="flex items-center gap-2 text-xs text-[#6c7a89] hover:text-[#5ecfff]">
          <User size={16}/> My profile
        </button>
      </div>
    </aside>
  );
}
