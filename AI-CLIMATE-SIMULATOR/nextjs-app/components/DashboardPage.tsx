
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-[#181821] font-sans">
      <DashboardSidebar active="Dashboard" />
      <div className="flex-1 flex flex-col h-full">
        <DashboardTopbar />
        <main className="flex-1 bg-[#23232b] p-8 overflow-y-auto">
          {/* TODO: Add main dashboard grid with charts and cards here */}
          <div className="w-full h-full flex items-center justify-center text-[#5ecfff] text-2xl font-bold opacity-60">Dashboard UI coming next...</div>
        </main>
      </div>
    </div>
  );
}
