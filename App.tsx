import React, { useState } from 'react';
import { User, UserRole, MaintenanceTicket, RiskLevel } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import MaintenanceHub from './components/MaintenanceHub';
import BillingInsights from './components/BillingInsights';

type View = 'Dashboard' | 'Maintenance Hub' | 'Detection Mesh' | 'Infrastructure Map' | 'Billing & Insights' | 'Neural Analytics' | 'Global Settings';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>('Dashboard');

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const menuItems = [
    { icon: 'fa-gauge', label: 'Dashboard' as View },
    { icon: 'fa-toolbox', label: 'Maintenance Hub' as View },
    { icon: 'fa-receipt', label: 'Billing & Insights' as View },
    { icon: 'fa-chart-network', label: 'Neural Analytics' as View },
    { icon: 'fa-users-gear', label: 'Global Settings' as View }
  ].filter(item => {
    if (user.role === UserRole.CONSUMER) {
      return ['Dashboard', 'Billing & Insights', 'Global Settings'].includes(item.label);
    }
    return true;
  });

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard user={user} onSelectTicket={() => setCurrentView('Maintenance Hub')} />;
      case 'Maintenance Hub':
        return <MaintenanceHub />;
      case 'Billing & Insights':
        return <BillingInsights />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center space-y-4">
              <i className="fas fa-hourglass-start text-4xl opacity-20"></i>
              <p className="text-sm font-black uppercase tracking-widest">{currentView} Module Loading...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#f9fbff] overflow-hidden font-sans antialiased text-slate-900">
      
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-100 transition-all duration-500 ease-in-out flex-shrink-0 z-[100] flex flex-col ${isSidebarOpen ? 'w-80' : 'w-[100px]'}`}>
        
        {/* Logo Section */}
        <div className="h-28 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="w-12 h-12 bg-[#1a237e] rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 flex-shrink-0 group hover:rotate-12 transition-transform duration-500">
              <i className="fas fa-droplet text-white text-xl"></i>
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-black text-xl text-slate-900 tracking-tighter leading-none">Aquaflow AI</span>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">v2.0 Enterprise</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentView(item.label);
              }}
              className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group ${
                currentView === item.label 
                ? 'bg-[#1a237e] text-white shadow-xl shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`flex items-center justify-center ${isSidebarOpen ? 'w-6 mr-5' : 'w-full'}`}>
                <i className={`fas ${item.icon} ${isSidebarOpen ? 'text-lg' : 'text-xl'}`}></i>
              </div>
              {isSidebarOpen && <span className="font-black text-sm tracking-tight">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Profile Card / Logout */}
        <div className="p-6">
          <div className={`bg-slate-50 rounded-[2.5rem] p-5 transition-all duration-500 border border-slate-100 ${isSidebarOpen ? 'w-full' : 'p-2'}`}>
            {isSidebarOpen ? (
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm overflow-hidden flex-shrink-0 bg-white">
                    <img src={`https://picsum.photos/48/48?u=${user.id}`} alt="user" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest truncate">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUser(null)}
                  className="w-full flex items-center justify-center py-3 bg-white text-rose-500 border border-rose-100 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 shadow-sm"
                >
                  <i className="fas fa-power-off mr-3"></i>
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setUser(null)}
                className="w-14 h-14 mx-auto flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all border border-slate-100"
              >
                <i className="fas fa-power-off"></i>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-28 px-10 flex items-center justify-between bg-white/60 backdrop-blur-2xl sticky top-0 z-[90] border-b border-slate-100/50">
           <div className="flex items-center space-x-10">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
              >
                <i className={`fas ${isSidebarOpen ? 'fa-align-left' : 'fa-align-justify'}`}></i>
              </button>
              
              <div className="hidden sm:block">
                 <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    <i className="fas fa-house-chimney-window text-[8px]"></i>
                    <i className="fas fa-chevron-right text-[6px]"></i>
                    <span className="text-slate-900">{user.organization}</span>
                 </div>
                 <h2 className="text-sm font-bold text-slate-500">Node Connectivity: <span className="text-emerald-500">Optimal</span></h2>
              </div>
           </div>

           <div className="flex items-center space-x-5">
              <div className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all relative cursor-pointer shadow-sm group">
                <i className="fas fa-bell"></i>
                <span className="absolute top-4 right-4 w-3 h-3 bg-rose-500 rounded-full border-[3px] border-white shadow-sm animate-bounce"></span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth bg-[#f9fbff]">
          {renderContent()}
          
          <div className="px-12 py-10 flex items-center justify-between border-t border-slate-100 mt-10">
             <div className="flex items-center space-x-3 grayscale opacity-30">
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shield text-slate-400 text-xs"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Environment</span>
             </div>
             <div className="text-[10px] font-bold text-slate-300">
               Session ID: {Math.random().toString(36).toUpperCase().substring(2, 10)} &bull; {new Date().toLocaleDateString()}
             </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 z-[100]">
          <button className="w-16 h-16 bg-[#1a237e] text-white rounded-[1.5rem] shadow-2xl shadow-indigo-500/40 flex items-center justify-center group hover:scale-110 transition-all duration-300">
            <i className="fas fa-comment-dots text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;