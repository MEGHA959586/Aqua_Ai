
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { SensorData, LeakReport, RiskLevel, MaintenanceTicket, User, UserRole } from '../types';
import { analyzeLeakData } from '../services/geminiService';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<LeakReport | null>(null);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);

  useEffect(() => {
    // Generate a 24-hour sensor window with a synthetic leak event
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
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Online &bull; Node Cluster A-12</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isAuthority && 'Operational Oversight'}
            {isEngineer && 'Diagnostic Command'}
            {isConsumer && 'Personal Consumption'}
          </h1>
          <p className="text-slate-500 font-medium max-w-lg">
            {isAuthority && 'Real-time infrastructure health and fiscal impact analysis for municipal water resources.'}
            {isEngineer && 'Detailed technical diagnostics, sensor logs, and maintenance dispatch queue.'}
            {isConsumer && 'Usage tracking, billing transparency, and local infrastructure status for your residence.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {(isAuthority || isEngineer) && (
            <button 
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="px-8 py-3.5 bg-[#1a237e] text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-500/20 hover:bg-[#121858] flex items-center space-x-3 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt-lightning"></i>}
              <span>{isAnalyzing ? 'Processing Nodes...' : 'AI Network Scan'}</span>
            </button>
          )}
          {isConsumer && (
            <button className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs shadow-sm hover:bg-slate-50 flex items-center space-x-3 transition-all">
              <i className="fas fa-file-invoice text-blue-500"></i>
              <span>Statement History</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Flow', val: '31.2 L/s', change: '+4.2%', icon: 'fa-water', color: 'blue' },
          { label: 'System Pressure', val: '2.4 Bar', change: '-15%', icon: 'fa-gauge-high', color: 'rose' },
          { label: 'Active Leaks', val: report?.isLeakDetected ? '1' : '0', change: 'Live AI', icon: 'fa-triangle-exclamation', color: 'amber' },
          { label: 'Cost Savings', val: '$12.4k', change: 'Monthly', icon: 'fa-money-bill-trend-up', color: 'emerald' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-200 transition-colors">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${kpi.icon} text-xl`}></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{kpi.label}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-black text-slate-900">{kpi.val}</h3>
              <span className={`text-[10px] font-bold ${kpi.color === 'rose' ? 'text-rose-500' : 'text-emerald-500'}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Analysis Pane (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Visualizer */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Technical Telemetry</h3>
                <p className="text-sm font-medium text-slate-400">Flow/Pressure synchronization over last 24 nodes</p>
              </div>
              <div className="flex space-x-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button className="px-5 py-2 bg-white text-[10px] font-black uppercase text-blue-600 rounded-lg shadow-sm border border-slate-100">Live</button>
                <button className="px-5 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">History</button>
              </div>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="flowRate" stroke="#3b82f6" strokeWidth={5} fill="url(#blueGrad)" name="Flow" />
                  <Area type="monotone" dataKey="pressure" stroke="#f43f5e" strokeWidth={3} fill="url(#roseGrad)" strokeDasharray="8 8" name="Pressure" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fas fa-circle text-[8px] text-blue-500"></i>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Flow (L/s)</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fas fa-circle text-[8px] text-rose-500"></i>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mean Pressure (Bar)</span>
              </div>
            </div>
          </div>

          {/* Network Map / Grid (Simulated) */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Mesh Status</h3>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">32 Active Sensors</span>
             </div>
             <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className={`h-16 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    i === 17 || i === 18 ? 'bg-rose-50 border-rose-200 text-rose-500 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500'
                  }`}>
                    <i className="fas fa-satellite-dish text-xs mb-1"></i>
                    <span className="text-[8px] font-black">{i + 101}</span>
                  </div>
                ))}
             </div>
             <div className="mt-8 p-5 bg-indigo-900 rounded-[1.5rem] flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <i className="fas fa-map-pin text-blue-300"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue-300/60">Selected Region</p>
                    <p className="text-sm font-bold">Sector 4 &bull; Industrial Core</p>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 transition-all px-6 py-2 rounded-xl border border-white/20">Expand View</button>
             </div>
          </div>
        </div>

        {/* Right Insights Pane (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* AI Diagnostic Core */}
          <div className="bg-[#1a237e] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold tracking-tight">AI Diagnostic Core</h3>
                <div className="p-2 bg-white/10 rounded-xl">
                  <i className="fas fa-brain text-blue-300"></i>
                </div>
              </div>

              {!report ? (
                <div className="space-y-6">
                  <p className="text-indigo-100/60 text-sm leading-relaxed">
                    System is actively monitoring all nodes. Perform a Pulse Scan to trigger neural classification of acoustic signatures.
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] font-black text-blue-300 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>
                    <span>Acoustic Sync: 100%</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                  <div className={`p-6 rounded-2xl flex items-center space-x-5 border ${
                    report.isLeakDetected ? 'bg-rose-500/20 border-rose-400/30 text-rose-100' : 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.isLeakDetected ? 'bg-rose-500' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}>
                      <i className={`fas ${report.isLeakDetected ? 'fa-triangle-exclamation' : 'fa-check'} text-white text-xl`}></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Diagnostic</p>
                      <p className="text-lg font-black">{report.isLeakDetected ? 'Leak Identified' : 'System Healthy'}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black uppercase text-blue-300/40 mb-2">Confidence Score</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black">{(report.confidence * 100).toFixed(0)}%</span>
                        <span className="text-[10px] font-bold text-blue-300">Gemini-3 Flash</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${report.confidence * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Target Sector</p>
                          <p className="text-sm font-bold text-indigo-100">{report.predictedArea}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">AI Logic</p>
                          <p className="text-xs text-indigo-100/60 leading-relaxed italic line-clamp-3">"{report.analysisSummary}"</p>
                       </div>
                    </div>

                    <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-white/5">
                       Dispatch Alert Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dispatch / Maintenance Queue */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Dispatches</h3>
              <i className="fas fa-ellipsis-h text-slate-300"></i>
            </div>
            
            <div className="space-y-5">
              {tickets.map((ticket, i) => (
                <div key={ticket.id} className="group p-5 rounded-[1.5rem] border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
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

            <button className="w-full mt-10 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 transition-all">
               <i className="fas fa-plus mr-2"></i> Create Manual Dispatch
            </button>
          </div>

          {/* Infrastructure Health Card (Consumer) */}
          {isConsumer && (
             <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <i className="fas fa-leaf text-emerald-400"></i>
                  </div>
                  <h3 className="text-lg font-bold">Sustainability Impact</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-emerald-400/60">Community Goal</span>
                    <span className="text-2xl font-black">82%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[82%]"></div>
                  </div>
                  <p className="text-xs text-emerald-100/60 leading-relaxed pt-2">
                    Your household is in the top 10% for water efficiency in North Sector. Keep it up!
                  </p>
                </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
