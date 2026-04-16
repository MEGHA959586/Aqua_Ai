import React from 'react';
import { MaintenanceTicket, RiskLevel } from '../types';

interface TicketDetailProps {
  ticket: MaintenanceTicket;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onBack }) => {
  const getPriorityColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL: return 'bg-rose-500 text-white';
      case RiskLevel.HIGH: return 'bg-orange-500 text-white';
      case RiskLevel.MEDIUM: return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  return (
    <div className="p-6 lg:p-12 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <nav className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <button onClick={onBack} className="hover:text-blue-600 transition-colors">Maintenance Hub</button>
            <i className="fas fa-chevron-right text-[8px]"></i>
            <span className="text-slate-900">{ticket.id}</span>
          </nav>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{ticket.leakArea}</h1>
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority} Priority
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-sm">
            <i className="fas fa-share-nodes mr-2"></i> Export Data
          </button>
          <button className="px-6 py-3 bg-[#1a237e] text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-500/20 hover:bg-[#121858] transition-all">
            Mark as Resolved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Asset & Diagnosis */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Asset Metadata */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center">
                <i className="fas fa-microchip mr-3 text-blue-500"></i>
                Asset Intelligence
              </h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Node</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Asset ID', value: ticket.assetMetadata?.assetId, icon: 'fa-tag' },
                { label: 'Zone/District', value: ticket.assetMetadata?.zone, icon: 'fa-map-location-dot' },
                { label: 'Install Year', value: ticket.assetMetadata?.installedYear, icon: 'fa-calendar-check' },
                { label: 'Material', value: ticket.assetMetadata?.materialType, icon: 'fa-layer-group' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <i className={`fas ${item.icon} text-blue-300`}></i>
                    <span>{item.label}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Diagnosis */}
          <div className="bg-[#f8faff] p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <i className="fas fa-brain text-8xl text-blue-900"></i>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8 flex items-center">
              <i className="fas fa-wand-magic-sparkles mr-3 text-indigo-500"></i>
              Neural Diagnostic Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Leak Probability Gauge */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={251.2} 
                      strokeDashoffset={251.2 * (1 - (ticket.aiDiagnosis?.leakProbability || 0) / 100)} 
                      className="text-blue-500" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900">
                    {ticket.aiDiagnosis?.leakProbability}%
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Leak Probability</p>
                <p className="text-xs font-bold text-slate-600">High Confidence Cluster</p>
              </div>

              {/* Vibration & Pressure */}
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vibration Anomaly</p>
                    <span className="text-xs font-black text-rose-500">{ticket.aiDiagnosis?.vibrationAnomaly}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[78%]"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pressure Deviation</p>
                    <span className="text-xs font-black text-amber-500">{ticket.aiDiagnosis?.pressureDeviation}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[45%]"></div>
                  </div>
                </div>
                <div className="pt-2 flex items-center space-x-3">
                  <i className="fas fa-wave-square text-indigo-400"></i>
                  <p className="text-xs italic text-slate-500">
                    "Acoustic frequency shift detected at <span className="font-bold text-slate-700">{ticket.aiDiagnosis?.acousticSignature}</span>"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Engineer Notes */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Engineer Logs & Notes</h3>
            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src="https://picsum.photos/40/40?u=marcus" alt="" />
                </div>
                <div className="flex-1 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">Eng. Marcus Wright</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">2 Hours Ago</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Preliminary inspection confirms micro-fissure. Material fatigue seems likely due to age. Recommending ultrasonic weld instead of patch.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  placeholder="Add operational notes or update dispatch status..." 
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm min-h-[120px]"
                ></textarea>
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <button className="p-3 bg-white text-slate-400 rounded-xl hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <button className="px-5 py-2.5 bg-[#1a237e] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                    Post Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Timeline */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Operational Timeline</h3>
            <div className="relative space-y-10 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-slate-200">
              {ticket.timeline?.map((event, i) => (
                <div key={event.id} className="relative pl-12">
                  <div className={`absolute left-0 top-1 w-8 h-8 rounded-xl flex items-center justify-center border-4 border-white shadow-sm ${
                    i === 0 ? 'bg-emerald-500' : i === ticket.timeline!.length - 1 ? 'bg-slate-200' : 'bg-blue-500'
                  }`}>
                    <i className={`fas ${i === 0 ? 'fa-check' : 'fa-circle'} text-[8px] text-white`}></i>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{event.status}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{event.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500">{event.description}</p>
                    {event.user && (
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                           <img src={`https://picsum.photos/20/20?u=${event.user}`} alt="" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{event.user}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Center */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">Command Center</h3>
            
            <button className="w-full p-5 bg-blue-50 text-blue-700 rounded-2xl flex items-center space-x-4 group hover:bg-blue-100 transition-all border border-blue-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-user-plus text-lg"></i>
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest">Reassign Node</p>
                <p className="text-[10px] font-medium opacity-60">Change maintenance lead</p>
              </div>
            </button>

            <button className="w-full p-5 bg-amber-50 text-amber-700 rounded-2xl flex items-center space-x-4 group hover:bg-amber-100 transition-all border border-amber-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <i className="fas fa-calendar-plus text-lg"></i>
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest">Schedule Check</p>
                <p className="text-[10px] font-medium opacity-60">Plan follow-up audit</p>
              </div>
            </button>

            <button className="w-full p-5 bg-slate-50 text-slate-400 rounded-2xl flex items-center space-x-4 cursor-not-allowed opacity-50 border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <i className="fas fa-print text-lg"></i>
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest">Print Label</p>
                <p className="text-[10px] font-medium opacity-60">Asset ID generation</p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketDetail;