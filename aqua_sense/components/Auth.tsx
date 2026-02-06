
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.MUNICIPAL_AUTHORITY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName: isLogin ? (email.split('@')[0]) : fullName,
      role,
      organization: isLogin ? (role === UserRole.CONSUMER ? 'Private Residence' : 'City Water Works') : organization
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] relative overflow-hidden font-sans">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden m-4 border border-white/50">
        {/* Left Side: Visual Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1a237e] p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-blue-900/80"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 border-4 border-white/10 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <i className="fas fa-droplet text-blue-300 text-2xl"></i>
              </div>
              <span className="text-white text-2xl font-black tracking-tight">Aquaflow AI</span>
            </div>
            
            <h1 className="text-5xl font-black text-white leading-[1.15] mb-6">
              Empowering <br/>
              <span className="text-blue-300 italic">Water Intelligence</span>
            </h1>
            <p className="text-indigo-100/70 text-lg leading-relaxed max-w-sm">
              The next generation of municipal leak detection and resource management, powered by advanced AI acoustics.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-400/20 rounded-xl">
                <i className="fas fa-check-double text-blue-300"></i>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Real-time Precision</p>
                <p className="text-indigo-200/50 text-xs">99.8% Leak detection accuracy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-slate-500 font-medium">Access your enterprise dashboard</p>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl mb-8">
              {[
                { r: UserRole.MUNICIPAL_AUTHORITY, label: 'Authority', icon: 'fa-building' },
                { r: UserRole.MAINTENANCE_ENGINEER, label: 'Engineer', icon: 'fa-wrench' },
                { r: UserRole.CONSUMER, label: 'User', icon: 'fa-house' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setRole(item.r)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center space-x-2 ${
                    role === item.r 
                    ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                      placeholder="e.g. Robert Smith"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Department / Organization</label>
                    <input
                      required
                      type="text"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                      placeholder="e.g. Westside Water Board"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Identifier</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <i className="fas fa-envelope text-sm"></i>
                  </div>
                  <input
                    required
                    type="email"
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                    placeholder="email@system.gov"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Passkey</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <i className="fas fa-shield-halved text-sm"></i>
                  </div>
                  <input
                    required
                    type="password"
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#1a237e] text-white rounded-[1.25rem] font-black text-sm shadow-xl shadow-indigo-500/20 hover:bg-[#121858] transition-all transform hover:-translate-y-0.5 active:scale-[0.98] mt-4 flex items-center justify-center space-x-2"
              >
                <span>{isLogin ? 'Enter Dashboard' : 'Create Profile'}</span>
                <i className="fas fa-chevron-right text-[10px] opacity-50"></i>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-sm font-medium">
                {isLogin ? "Need administrative access?" : "Already have system credentials?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-600 font-black hover:text-blue-700 transition-colors"
                >
                  {isLogin ? 'Register Now' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <p className="absolute bottom-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        Aquaflow AI &copy; 2024 &bull; Industrial Infrastructure Security
      </p>
    </div>
  );
};

export default Auth;
