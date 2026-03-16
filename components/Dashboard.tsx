import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { SensorData, LeakReport, RiskLevel, MaintenanceTicket, User, UserRole } from '../types';
import { analyzeLeakData } from '../services/geminiService';

interface DashboardProps {
  user: User;
  onSelectTicket?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSelectTicket }) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<LeakReport | null>(null);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);

  useEffect(() => {
    const mockData: SensorData[] = Array.from({ length: 24 }, (_, i) => {
      const isAnomalyTime = i >= 16;
      return {
        timestamp: `${i}:00`,
        flowRate: 15 + Math.random() * 3 + (isAnomalyTime ? 15 : 0),
        pressure: 4.5 - Math.random() * 0.4 - (isAnomalyTime ? 2.1 : 0),
        acousticFreq: 60 + Math.random() * 15 + (isAnomalyTime ? 120 : 0),
        vibrationLevel: 0.12 + Math.random() * 0.04 + (isAnomalyTime ? 0.35 : 0)
      };
    });
    setData(mockData);

    setTickets([
      { id: 'INFRA-901', leakArea: 'Sector 4: High Street', assignedTo: 'Engineer Marcus', status: 'In Progress', priority: RiskLevel.MEDIUM, createdAt: '2024-03-01' },
      { id: 'INFRA-902', leakArea: 'Main Junction Reservoir', assignedTo: 'Unassigned', status: 'Open', priority: RiskLevel.CRITICAL, createdAt: '2024-03-02' },
      { id: 'INFRA-903', leakArea: 'Green Valley Pumping', assignedTo: 'Engineer Sarah', status: 'Resolved', priority: RiskLevel.LOW, createdAt: '2024-02-28' }
    ]);
  }, []);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeLeakData(data);
      setReport(result);
    } catch (err) {
      console.error("Analysis Failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isAuthority = user.role === UserRole.MUNICIPAL_AUTHORITY;
  const isEngineer = user.role === UserRole.MAINTENANCE_ENGINEER;
  const isConsumer = user.role === UserRole.CONSUMER;

  return (
    <div className="p-6 lg:p-12 space-y-10 animate-in fade-in duration-700 bg-[#f9fbff] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Online</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isAuthority && 'Operational Oversight'}
            {isEngineer && 'Diagnostic Command'}
            {isConsumer && 'Personal Consumption'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {(isAuthority || isEngineer) && (
            <button 
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="px-8 py-3.5 bg-[#1a237e] text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-500/20 hover:bg-[#121858] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt-lightning"></i>}
              <span>{isAnalyzing ? 'Processing Nodes...' : 'AI Network Scan'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Flow', val: '31.2 L/s', change: '+4.2%', icon: 'fa-water', color: 'blue' },
          { label: 'System Pressure', val: '2.4 Bar', change: '-15%', icon: 'fa-gauge-high', color: 'rose' },
          { label: 'Active Leaks', val: report?.isLeakDetected ? '1' : '0', change: 'Live AI', icon: 'fa-triangle-exclamation', color: 'amber' },
          { label: 'Cost Savings', val: '$12.4k', change: 'Monthly', icon: 'fa-money-bill-trend-up', color: 'emerald' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-${kpi.color}-50 text-${kpi.color}-600`}>
              <i className={`fas ${kpi.icon} text-xl`}></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{kpi.label}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-black text-slate-900">{kpi.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-10">Technical Telemetry</h3>
            <div className="h-[460px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="flowRate" stroke="#3b82f6" strokeWidth={5} fillOpacity={0.1} fill="#3b82f6" name="Flow" />
                  <Area type="monotone" dataKey="pressure" stroke="#f43f5e" strokeWidth={3} fillOpacity={0} name="Pressure" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Active Dispatches</h3>
            <div className="space-y-5">
              {tickets.map((ticket, i) => (
                <div 
                  key={ticket.id} 
                  onClick={() => onSelectTicket?.(ticket.id)}
                  className="group p-5 rounded-[1.5rem] border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ticket.id}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase ${
                      ticket.priority === RiskLevel.CRITICAL ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors mb-3 leading-tight">{ticket.leakArea}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100">
                        <img src={`https://picsum.photos/32/32?random=${i}`} alt="user" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{ticket.assignedTo}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase">{ticket.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;