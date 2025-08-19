"use client";
import { Bell, User, Mail, Search } from 'lucide-react';

export default function DashboardTopbar() {
  return (
    <header className="w-full h-16 bg-[#23232b] border-b border-[#33334a] flex items-center px-8 justify-between font-sans">
      <div className="flex items-center gap-4">
        <span className="text-[#5ecfff] font-bold text-xl tracking-widest">Dashboard</span>
        <span className="ml-8 text-[#bfc9d8] text-sm">Analytics</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-[#23232b] px-3 py-1 rounded-full border border-[#33334a]">
          <Search size={16} className="text-[#5ecfff]"/>
          <input className="bg-transparent outline-none text-xs text-[#bfc9d8] w-32" placeholder="Search" />
        </div>
        <Bell size={20} className="text-[#5ecfff] cursor-pointer"/>
        <Mail size={20} className="text-[#5ecfff] cursor-pointer"/>
        <div className="w-8 h-8 rounded-full bg-[#5ecfff] flex items-center justify-center text-white font-bold cursor-pointer">
          <User size={18}/>
        </div>
      </div>
    </header>
  );
}
