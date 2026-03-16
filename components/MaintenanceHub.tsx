import React, { useState, useMemo } from 'react';
import { RiskLevel, PredictiveAlert, MaintenanceTicket, AssetHealth } from '../types';

const MaintenanceHub: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<MaintenanceTicket | null>(null);
  const [engineerSearchQuery, setEngineerSearchQuery] = useState('');

  // Operational Data
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([
    { id: 'AL-402', assetId: 'PUMP-09', location: 'West Station', severity: RiskLevel.CRITICAL, confidence: 0.94, etaToFailure: '36 Hours', issueType: 'Bearing Friction' },
    { id: 'AL-404', assetId: 'PIPE-A12', location: 'High Street', severity: RiskLevel.HIGH, confidence: 0.88, etaToFailure: '12 Hours', issueType: 'Stress Fracture' },
    { id: 'AL-403', assetId: 'VALVE-22', location: 'Main Reservoir', severity: RiskLevel.MEDIUM, confidence: 0.81, etaToFailure: '5 Days', issueType: 'Seal Degradation' },
  ]);

  const [tasks, setTasks] = useState<MaintenanceTicket[]>([
    { 
      id: 'MNT-1024', 
      leakArea: 'Downtown Grid Node-X', 
      assignedTo: 'Engineer Marcus', 
      status: 'In Progress', 
      priority: RiskLevel.HIGH, 
      createdAt: '2024-03-01', 
      dueDate: '2024-03-05', 
      issueType: 'Pressure Recalibration',
      assetMetadata: { assetId: 'NODE-X102', zone: 'Downtown', installedYear: '2005', materialType: 'PVC-HighDensity', lastInspection: '2023-11-01' },
      aiDiagnosis: { leakProbability: 84, vibrationAnomaly: 'Moderate', pressureDeviation: '-1.2 psi', acousticSignature: '90Hz Peak' },
      timeline: [{ id: 't1', status: 'Detected', timestamp: '09:00 AM', description: 'System AI triggered pressure alert.' }]
    },
    { 
      id: 'MNT-1026', 
      leakArea: 'North Pumping Hub', 
      assignedTo: 'Unassigned', 
      status: 'Overdue', 
      priority: RiskLevel.CRITICAL, 
      createdAt: '2024-02-20', 
      dueDate: '2024-03-01', 
      issueType: 'Filter Replacement',
      assetMetadata: { assetId: 'PUMP-N04', zone: 'North Industrial', installedYear: '2012', materialType: 'Steel Alloy', lastInspection: '2023-05-15' },
      aiDiagnosis: { leakProbability: 12, vibrationAnomaly: 'Critical', pressureDeviation: 'None', acousticSignature: 'Harmonic Drift' },
      timeline: [{ id: 't2', status: 'Detected', timestamp: 'Feb 20', description: 'Vibration sensors hit critical threshold.' }]
    },
    { 
      id: 'MNT-1025', 
      leakArea: 'Sector 4 Junction', 
      assignedTo: 'Engineer Sarah', 
      status: 'Scheduled', 
      priority: RiskLevel.MEDIUM, 
      createdAt: '2024-03-02', 
      dueDate: '2024-03-08', 
      issueType: 'Asset Inspection' 
    },
  ]);

  const engineers = [
    { name: 'Engineer Marcus', specialty: 'Pressure Hydraulics', distance: '0.5km', status: 'On Duty' },
    { name: 'Engineer Sarah', specialty: 'Acoustic Analysis', distance: '1.2km', status: 'On Duty' },
    { name: 'Engineer David', specialty: 'Pipe Material Tech', distance: '3.4km', status: 'En Route' },
    { name: 'Engineer Priya', specialty: 'Valve Optimization', distance: '2.1km', status: 'On Duty' },
    { name: 'Engineer Robert', specialty: 'Pump Electronics', distance: '5.0km', status: 'Offline' },
    { name: 'Engineer Elena', specialty: 'Grid Logistics', distance: '0.8km', status: 'On Duty' },
  ];

  const filteredEngineers = useMemo(() => {
    return engineers.filter(eng => 
      eng.name.toLowerCase().includes(engineerSearchQuery.toLowerCase()) ||
      eng.specialty.toLowerCase().includes(engineerSearchQuery.toLowerCase())
    );
  }, [engineerSearchQuery]);

  const assetHealth: AssetHealth[] = [
    { name: 'Pipes', type: 'Pipe', healthScore: 92, status: 'Optimal' },
    { name: 'Pumps', type: 'Pump', healthScore: 68, status: 'Degraded' },
    { name: 'Valves', type: 'Valve', healthScore: 84, status: 'Optimal' },
    { name: 'Reservoirs', type: 'Reservoir', healthScore: 96, status: 'Optimal' },
  ];

  const handleOpenDetail = (ticket: MaintenanceTicket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  const getPriorityStyle = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL: return 'bg-rose-100 text-rose-700 border-rose-200';
      case RiskLevel.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case RiskLevel.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500';
      case 'Overdue': return 'bg-rose-500';
      case 'Scheduled': return 'bg-slate-300';
      default: return 'bg-emerald-500';
    }
  };

  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicket: MaintenanceTicket = {
      id: `MNT-${Math.floor(Math.random() * 9000 + 1000)}`,
      leakArea: formData.get('area') as string,
      assignedTo: 'Unassigned',
      status: 'Scheduled',
      priority: formData.get('priority') as RiskLevel,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: formData.get('dueDate') as string,
      issueType: formData.get('issueType') as string,
      assetMetadata: {
        assetId: formData.get('assetId') as string,
        zone: 'New Zone',
        installedYear: '2020',
        materialType: 'Unknown',
        lastInspection: 'N/A'
      }
    };
    setTasks([newTicket, ...tasks]);
    setIsCreateModalOpen(false);
  };

  const handleAssignEngineer = (ticketId: string, engineer: string) => {
    setTasks(tasks.map(t => t.id === ticketId ? { ...t, assignedTo: engineer, status: 'In Progress' } : t));
    setIsAssignModalOpen(false);
    setAssignTarget(null);
    setEngineerSearchQuery('');
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setAssignTarget(null);
    setEngineerSearchQuery('');
  };

  return (
    <div className="p-8 lg:p-12 bg-white min-h-screen relative overflow-hidden font-sans">
      
      {/* Section 1: Maintenance Status & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Hub</h1>
          <p className="text-slate-500 font-medium">Predictive maintenance and asset health management</p>
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-slate-900">{tasks.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Open Tickets</span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-rose-500">{tasks.filter(t => t.priority === RiskLevel.CRITICAL).length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Risk Assets</span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-slate-900">4.2h</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Repair Time</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsAssignModalOpen(true)}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center"
          >
            <i className="fas fa-user-plus mr-2 opacity-50"></i>
            Assign Engineer
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-[#1a237e] text-white rounded-xl font-black text-xs shadow-xl shadow-indigo-500/20 hover:bg-[#121858] transition-all flex items-center"
          >
            <i className="fas fa-plus-circle mr-2 opacity-50"></i>
            Create Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Operational Area */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section 2: Active Maintenance Tasks */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Active Task Queue</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => handleOpenDetail(task)}
                  className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(task.status)}`}></div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-xs font-black text-slate-900">{task.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{task.issueType} &bull; {task.leakArea}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-600">{task.assignedTo}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Due: {task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Asset Health Snapshot */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Network Vital Condition</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {assetHealth.map((asset) => (
                <div key={asset.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3 hover:border-blue-200 transition-all">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                      <circle 
                        cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                        strokeDasharray={175.9} 
                        strokeDashoffset={175.9 * (1 - asset.healthScore / 100)} 
                        className={asset.healthScore > 90 ? 'text-emerald-500' : asset.healthScore > 70 ? 'text-blue-500' : 'text-amber-500'} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-900">
                      {asset.healthScore}%
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{asset.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: AI Alerts */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section 3: Predictive Alerts & AI Recommendations */}
          <div className="bg-[#1a237e] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <i className="fas fa-brain text-6xl"></i>
            </div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-lg font-bold flex items-center">
                <i className="fas fa-bolt-lightning mr-3 text-blue-300"></i>
                Neural Logic Alerts
              </h2>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group/alert">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">{alert.assetId}</span>
                      <span className="text-[10px] font-bold text-white/50">{alert.etaToFailure}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-2">{alert.issueType} @ {alert.location}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center text-[9px] font-black text-emerald-400">
                        <i className="fas fa-robot mr-1.5"></i>
                        {alert.confidence * 100}% CONF
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAssignModalOpen(true);
                        }}
                        className="text-[9px] font-black uppercase text-blue-300 group-hover/alert:text-white transition-colors"
                      >
                        Assign <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Audit Predictive Logs
              </button>
            </div>
          </div>

          {/* Maintenance Advice */}
          <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">System Recommendation</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              "Acoustic nodes at Sector 4 identify micro-fissure expansion. Immediate preventive ultrasonic inspection is suggested to avoid nocturnal burst risks."
            </p>
          </div>

        </div>
      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generate Maintenance Ticket</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleCreateTicket} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset ID</label>
                    <input name="assetId" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="e.g. PIPE-X02" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority</label>
                    <select name="priority" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none">
                      <option value={RiskLevel.LOW}>Low</option>
                      <option value={RiskLevel.MEDIUM}>Medium</option>
                      <option value={RiskLevel.HIGH}>High</option>
                      <option value={RiskLevel.CRITICAL}>Critical</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location / Area</label>
                  <input name="area" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="e.g. North Sector B" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Issue Classification</label>
                  <input name="issueType" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Acoustic Drift Detected" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Date</label>
                  <input name="dueDate" type="date" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#1a237e] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                  Authorize Operational Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Engineer Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeAssignModal}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-400 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a237e]/10 flex items-center justify-center">
                  <i className="fas fa-helmet-safety text-[#1a237e]"></i>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Engineer Deployment</h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {assignTarget ? 'Step 2: Assign Personnel' : 'Step 1: Select Active Task'}
                  </p>
                </div>
              </div>
              <button onClick={closeAssignModal} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-300 hover:text-slate-900 transition-all">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {!assignTarget ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Available Maintenance Tasks</h3>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded">{tasks.filter(t => t.assignedTo === 'Unassigned').length} Open</span>
                  </div>
                  <div className="space-y-3">
                    {tasks.filter(t => t.assignedTo === 'Unassigned').map(task => (
                      <button 
                        key={task.id} 
                        onClick={() => setAssignTarget(task)}
                        className="w-full p-6 flex items-center justify-between bg-white border border-slate-100 rounded-[1.5rem] hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group shadow-sm"
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`w-3 h-3 rounded-full ${getStatusDot(task.status)}`}></div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-black text-slate-900">{task.id}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[7px] font-black border ${getPriorityStyle(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-700">{task.issueType}</h4>
                            <p className="text-[10px] font-medium text-slate-400">{task.leakArea}</p>
                          </div>
                        </div>
                        <i className="fas fa-chevron-right text-slate-200 group-hover:text-blue-500 transition-all"></i>
                      </button>
                    ))}
                    {tasks.filter(t => t.assignedTo === 'Unassigned').length === 0 && (
                      <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                          <i className="fas fa-check-double text-slate-200 text-2xl"></i>
                        </div>
                        <p className="text-xs text-slate-400 font-medium italic">All current tasks have been dispatched.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  {/* Selected Task Prominent Display */}
                  <div className="bg-[#1a237e] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <i className="fas fa-wrench text-6xl"></i>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <button 
                          onClick={() => setAssignTarget(null)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center"
                        >
                          <i className="fas fa-arrow-left mr-2"></i> Back to Tasks
                        </button>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${getPriorityStyle(assignTarget.priority)} bg-white shadow-lg`}>
                          {assignTarget.priority}
                        </span>
                      </div>
                      <h4 className="text-xl font-black tracking-tight mb-2">{assignTarget.issueType}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div>
                          <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Asset Reference</p>
                          <p className="text-xs font-bold">{assignTarget.id} &bull; {assignTarget.assetMetadata?.assetId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Deployment Zone</p>
                          <p className="text-xs font-bold">{assignTarget.leakArea}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Searchable Engineer List */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Deploy Field Personnel</h3>
                      <span className="text-[9px] font-bold text-slate-300">{filteredEngineers.length} available</span>
                    </div>

                    <div className="relative group">
                      <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                      <input 
                        value={engineerSearchQuery}
                        onChange={(e) => setEngineerSearchQuery(e.target.value)}
                        placeholder="Search by name or technical specialty..."
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-3">
                      {filteredEngineers.map((eng, idx) => (
                        <button 
                          key={eng.name}
                          onClick={() => handleAssignEngineer(assignTarget.id, eng.name)}
                          className="w-full p-4 flex items-center justify-between bg-white border border-slate-100 rounded-2xl hover:border-[#1a237e] hover:bg-[#1a237e]/5 transition-all group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-50">
                                <img src={`https://picsum.photos/48/48?u=${eng.name}`} alt="" />
                              </div>
                              {eng.status === 'On Duty' && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black text-slate-900 group-hover:text-[#1a237e] transition-colors">{eng.name}</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-[10px] font-bold text-slate-400">{eng.specialty}</p>
                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                <p className="text-[9px] font-black text-blue-600 uppercase">{eng.distance}</p>
                              </div>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                            <i className="fas fa-plus text-[#1a237e]"></i>
                          </div>
                        </button>
                      ))}
                      {filteredEngineers.length === 0 && (
                        <p className="text-center py-10 text-xs text-slate-400 italic">No matching personnel found for "{engineerSearchQuery}"</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Sticky if content grows) */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/20 text-center">
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                Authorized dispatch updates are tracked and logged in the operational neural mesh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Maintenance Ticket Detail View (Slide-in Panel) */}
      {isDetailOpen && selectedTicket && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[200] animate-in fade-in duration-300" 
            onClick={() => setIsDetailOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-[210] animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-10 space-y-10">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedTicket.id}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTicket.leakArea}</h2>
                </div>
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Asset Metadata */}
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: 'Asset Identifier', value: selectedTicket.assetMetadata?.assetId || 'Unknown', icon: 'fa-tag' },
                  { label: 'Installation', value: selectedTicket.assetMetadata?.installedYear || 'N/A', icon: 'fa-calendar' },
                  { label: 'Zone/District', value: selectedTicket.assetMetadata?.zone || 'Unassigned', icon: 'fa-location-dot' },
                  { label: 'Material', value: selectedTicket.assetMetadata?.materialType || 'Standard', icon: 'fa-layer-group' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                      <i className={`fas ${item.icon} mr-1.5 opacity-40`}></i> {item.label}
                    </p>
                    <p className="text-sm font-bold text-slate-700">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* AI Diagnostics */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <i className="fas fa-microchip mr-2 text-blue-500"></i> AI Diagnostic Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{selectedTicket.aiDiagnosis?.leakProbability || 0}%</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Leak Prob.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{selectedTicket.aiDiagnosis?.pressureDeviation || '0'}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Pres. Delta</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{selectedTicket.aiDiagnosis?.vibrationAnomaly || 'Norm'}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Vibe State</p>
                  </div>
                </div>
              </div>

              {/* Notes & Actions */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Logs</h3>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 min-h-[100px] text-xs text-slate-500 italic">
                  {selectedTicket.timeline?.[0]?.description || "Waiting for initial site assessment from dispatched team..."}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button className="py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Schedule Follow-up
                  </button>
                  <button 
                    onClick={() => {
                      setTasks(tasks.filter(t => t.id !== selectedTicket.id));
                      setIsDetailOpen(false);
                    }}
                    className="py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default MaintenanceHub;