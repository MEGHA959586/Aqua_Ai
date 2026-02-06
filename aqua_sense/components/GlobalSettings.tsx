
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface GlobalSettingsProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const GlobalSettings: React.FC<GlobalSettingsProps> = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'Profile' | 'System' | 'Notifications' | 'Security'>('Profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Local form state
  const [fullName, setFullName] = useState(user.fullName);
  const [organization, setOrganization] = useState(user.organization);
  const [email, setEmail] = useState(user.email);
  
  // Preference state
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    alerts: true,
    critical: true
  });
  
  const [refreshRate, setRefreshRate] = useState('30s');
  const [autoDispatch, setAutoDispatch] = useState(false);
  const [leakSensitivity, setLeakSensitivity] = useState(85);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUserUpdate({
        ...user,
        fullName,
        organization,
        email
      });
      setIsSaving(false);
      // Simulate toast
      alert('System preferences updated successfully.');
    }, 1000);
  };

  const tabs = [
    { id: 'Profile', icon: 'fa-user-circle' },
    { id: 'System', icon: 'fa-server' },
    { id: 'Notifications', icon: 'fa-bell' },
    { id: 'Security', icon: 'fa-shield-halved' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-100">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                  <img src={`https://picsum.photos/128/128?u=${user.id}`} alt="User Avatar" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1a237e] text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <i className="fas fa-camera text-xs"></i>
                </button>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black text-slate-900">{fullName}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">{user.role}</p>
                <p className="text-xs text-slate-400 font-medium">Node ID: {user.id.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Organizational Unit</label>
                <input 
                  type="text" 
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verified Communication Channel (Email)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        );

      case 'System':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center">
                <i className="fas fa-microchip mr-2 text-blue-500"></i> AI & Network Intelligence
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-black text-slate-900">Telemetry Refresh Rate</p>
                      <p className="text-[10px] text-slate-400 font-bold">Node sync frequency</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['15s', '30s', '1m', '5m'].map(rate => (
                      <button 
                        key={rate}
                        onClick={() => setRefreshRate(rate)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${
                          refreshRate === rate ? 'bg-[#1a237e] text-white border-[#1a237e]' : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex justify-between items-center">
                  <div>
                    <p className="text-sm font-black text-slate-900">Auto-Dispatch Protocol</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">AI Autonomous maintenance</p>
                  </div>
                  <button 
                    onClick={() => setAutoDispatch(!autoDispatch)}
                    className={`w-14 h-8 rounded-full transition-all relative ${autoDispatch ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${autoDispatch ? 'right-1' : 'left-1 shadow-sm'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Leak Detection Sensitivity</h4>
                <span className="text-lg font-black text-[#1a237e]">{leakSensitivity}%</span>
              </div>
              <input 
                type="range" 
                min="50" max="100" 
                value={leakSensitivity}
                onChange={(e) => setLeakSensitivity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#1a237e]" 
              />
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                Higher sensitivity increases detection rate but may increase false-positive flags in acoustic signatures.
              </p>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {[
              { id: 'push', label: 'Push Notifications', desc: 'Real-time alerts via system interface', icon: 'fa-mobile-screen' },
              { id: 'email', label: 'Email Digest', desc: 'Weekly summary of infrastructure health', icon: 'fa-envelope-open-text' },
              { id: 'alerts', label: 'Critical Failure Alarms', desc: 'Priority sound triggers for risk level High/Critical', icon: 'fa-triangle-exclamation' },
              { id: 'critical', label: 'AI Prediction Alerts', desc: 'Pre-emptive notification for asset failure', icon: 'fa-brain' },
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                    <i className={`fas ${pref.icon}`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{pref.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{pref.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(prev => ({ ...prev, [pref.id]: !prev[pref.id as keyof typeof notifications] }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${notifications[pref.id as keyof typeof notifications] ? 'bg-[#1a237e]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${notifications[pref.id as keyof typeof notifications] ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
            ))}
          </div>
        );

      case 'Security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-8 bg-rose-50/50 border border-rose-100 rounded-3xl space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 flex items-center">
                <i className="fas fa-lock mr-2"></i> Identity & Access
              </h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                You are currently authenticated as an <span className="font-black">Authorized Internal Node</span>. 
                System-wide changes are logged under your signature for audit compliance.
              </p>
              <button className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                Reset Secure Passkey
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Active Sessions</h4>
              <div className="bg-white border border-slate-100 rounded-[1.5rem] divide-y divide-slate-50">
                <div className="p-5 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-desktop text-emerald-500"></i>
                    <p className="text-xs font-bold text-slate-700">Chrome on MacOS (Current)</p>
                  </div>
                  <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="p-5 flex justify-between items-center opacity-50">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-mobile-button text-slate-400"></i>
                    <p className="text-xs font-bold text-slate-700">Aquaflow Mobile App v1.4</p>
                  </div>
                  <button className="text-[8px] font-black text-rose-600 uppercase">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 lg:p-12 bg-[#f9fbff] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Enterprise Suite</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global System Settings</h1>
            <p className="text-slate-500 font-medium italic">Configure operational thresholds and personal node profile.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-4 bg-[#1a237e] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.1em] shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3"
          >
            {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-floppy-disk"></i>}
            <span>{isSaving ? 'Syncing...' : 'Save Preferences'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Settings Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full p-5 rounded-[1.5rem] flex items-center space-x-4 transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white shadow-xl shadow-slate-200/50 text-[#1a237e] border border-blue-50' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-blue-50' : 'bg-slate-100/50'}`}>
                  <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'text-[#1a237e]' : 'text-slate-400'}`}></i>
                </div>
                <span className="font-black text-sm tracking-tight">{tab.id}</span>
              </button>
            ))}

            <div className="mt-12 p-6 bg-[#1a237e] rounded-[2rem] text-white/90 space-y-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <i className="fas fa-circle-info text-blue-300"></i>
              </div>
              <p className="text-[10px] font-bold leading-relaxed">
                Need a higher administrative level or specialized node permissions? Contact Infrastructure Ops.
              </p>
              <button className="text-[9px] font-black uppercase text-blue-300 hover:text-white transition-colors">
                Contact Support <i className="fas fa-external-link ml-1"></i>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-9 bg-white p-10 lg:p-14 rounded-[3rem] shadow-sm border border-slate-100 min-h-[600px]">
             {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
