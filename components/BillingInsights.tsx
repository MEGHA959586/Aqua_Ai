import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { ConsumptionTrend, ZoneBillingData } from '../types';

const BillingInsights: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const trends: ConsumptionTrend[] = [
    { date: '01 Mar', North: 4500, South: 3200, East: 2800, West: 4100 },
    { date: '02 Mar', North: 4600, South: 3400, East: 2900, West: 4200 },
    { date: '03 Mar', North: 4800, South: 3100, East: 3100, West: 4300 },
    { date: '04 Mar', North: 4700, South: 3500, East: 3000, West: 4000 },
    { date: '05 Mar', North: 4900, South: 3600, East: 3200, West: 4500 },
    { date: '06 Mar', North: 5100, South: 3800, East: 3300, West: 4600 },
    { date: '07 Mar', North: 5000, South: 3700, East: 3100, West: 4400 },
  ];

  const zoneData: ZoneBillingData[] = [
    { id: 'ZN-01', name: 'North Residential', suppliedVolume: 145200, billedVolume: 132100, revenue: 158520, population: 42000, leakageLossEstimate: 15720 },
    { id: 'ZN-02', name: 'South Industrial', suppliedVolume: 210800, billedVolume: 185400, revenue: 370800, population: 12000, leakageLossEstimate: 50800 },
    { id: 'ZN-03', name: 'East Commercial', suppliedVolume: 98000, billedVolume: 92400, revenue: 231000, population: 8500, leakageLossEstimate: 14000 },
    { id: 'ZN-04', name: 'West Sector Hub', suppliedVolume: 168000, billedVolume: 141000, revenue: 169200, population: 38000, leakageLossEstimate: 32400 },
  ];

  const revenueLossData = [
    { category: 'North', revenue: 158520, loss: 15720 },
    { category: 'South', revenue: 370800, loss: 50800 },
    { category: 'East', revenue: 231000, loss: 14000 },
    { category: 'West', revenue: 169200, loss: 32400 },
  ];

  const handleExport = () => {
    setIsExporting(true);
    // Brief delay to allow the user to see the "Generating" state
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto p-12 space-y-20 bg-white shadow-sm min-h-screen border-x border-slate-100 animate-in fade-in duration-700 print:shadow-none print:border-none print:p-0">
      
      {/* Report Header */}
      <div className="space-y-6 pb-12 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Insights Analysis</h1>
            <p className="text-slate-500 font-medium">Fiscal Year 2024 • Monthly Operational Performance Report</p>
          </div>
          <div className="flex space-x-3 print:hidden">
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-400">Range:</span>
              <select className="bg-transparent text-xs font-bold outline-none text-slate-700">
                <option>March 2024</option>
                <option>February 2024</option>
                <option>January 2024</option>
              </select>
            </div>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 bg-[#1a237e] text-white rounded-xl text-xs font-black hover:bg-[#121858] transition-all flex items-center space-x-2 disabled:opacity-70"
            >
              {isExporting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-file-export"></i>
              )}
              <span>{isExporting ? 'Generating Report...' : 'Export Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: System-Wide Billing Summary */}
      <section className="space-y-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">01. System-Wide Fiscal Summary</h2>
        <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
          {[
            { label: 'Total Water Distributed', val: '622,000 KL', note: 'Up 2.4% from previous cycle due to seasonal shift.' },
            { label: 'Revenue Generated', val: '$929,520.00', note: 'Exceeds fiscal forecast by 1.2%.' },
            { label: 'Non-Revenue Water (NRW)', val: '18.2%', note: 'Down from 21.4%. Strategic leak repairs impacting loss reduction.' },
            { label: 'AI Cost Optimization', val: '$42,300.00', note: 'Estimated operational savings from predictive maintenance.' }
          ].map((item, i) => (
            <div key={i} className="py-6 flex flex-col md:flex-row md:items-center justify-between group">
              <div className="md:w-1/3">
                <span className="text-sm font-black text-slate-900">{item.label}</span>
              </div>
              <div className="md:w-1/4">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{item.val}</span>
              </div>
              <div className="md:w-5/12">
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Water Consumption Trends */}
      <section className="space-y-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">02. Multi-Zone Consumption Telemetry</h2>
        <div className="h-[400px] w-full print:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Area type="monotone" dataKey="North" stroke="#3b82f6" fillOpacity={0.05} fill="#3b82f6" strokeWidth={3} />
              <Area type="monotone" dataKey="South" stroke="#10b981" fillOpacity={0.05} fill="#10b981" strokeWidth={3} />
              <Area type="monotone" dataKey="East" stroke="#f59e0b" fillOpacity={0.05} fill="#f59e0b" strokeWidth={3} />
              <Area type="monotone" dataKey="West" stroke="#6366f1" fillOpacity={0.05} fill="#6366f1" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="max-w-3xl">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            The data above illustrates a progressive increase in water demand within the North Residential and South Industrial sectors. 
            Peak demand was observed between the 5th and 6th of March, correlating with industrial production cycles. 
            Current supply levels remain within safe operational thresholds, though the West Sector Hub shows emerging consumption 
            irregularities that warrant further investigation via neural analytics.
          </p>
        </div>
      </section>

      {/* Section 3: Revenue vs Loss Analysis */}
      <section className="space-y-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">03. Revenue vs Unbilled Sustainability Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 h-[350px] print:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueLossData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} />
                <Tooltip />
                <Legend iconType="rect" />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Billed Revenue ($)" />
                <Bar dataKey="loss" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Unbilled Loss ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">Sustainability Insight</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                The unbilled revenue gap in the South Industrial sector represents a 13.7% loss margin. 
                Our simulation suggests that approximately 65% of this loss is attributable to infrastructure aging in Reservoir-3. 
                Addressing these leakages is projected to recover $32,000 in monthly revenue, substantially improving 
                the organization's fiscal sustainability index.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Zone-wise Billing Breakdown */}
      <section className="space-y-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">04. Granular Zone Billing Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="py-4 pr-4">Zone Identifier</th>
                <th className="py-4 pr-4">Supplied (KL)</th>
                <th className="py-4 pr-4">Billed (KL)</th>
                <th className="py-4 pr-4 text-right">Revenue ($)</th>
                <th className="py-4 pr-4 text-right">Loss Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zoneData.map((zone) => {
                const lossPct = ((zone.suppliedVolume - zone.billedVolume) / zone.suppliedVolume) * 100;
                return (
                  <tr key={zone.id} className={`${lossPct > 15 ? 'bg-rose-50/30' : ''} hover:bg-slate-50 transition-colors`}>
                    <td className="py-6 pr-4">
                      <span className="text-xs font-black text-slate-900">{zone.name}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{zone.id}</p>
                    </td>
                    <td className="py-6 pr-4 text-xs font-bold text-slate-600">{zone.suppliedVolume.toLocaleString()}</td>
                    <td className="py-6 pr-4 text-xs font-bold text-slate-600">{zone.billedVolume.toLocaleString()}</td>
                    <td className="py-6 pr-4 text-right text-sm font-black text-slate-900">${zone.revenue.toLocaleString()}</td>
                    <td className="py-6 pr-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-xs font-black ${lossPct > 15 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {lossPct.toFixed(1)}%
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Zone-Level Insight Snapshot */}
      <section className="space-y-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">05. Zone-Level Strategic Snapshots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {zoneData.map((zone) => (
            <div key={zone.id} className="p-8 border border-slate-100 rounded-3xl space-y-4 hover:shadow-md transition-shadow cursor-default print:shadow-none">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-black text-slate-900">{zone.name}</h4>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{zone.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Residents Served</p>
                  <p className="text-sm font-bold text-slate-700">{zone.population.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Revenue Loss</p>
                  <p className="text-sm font-bold text-rose-500">${zone.leakageLossEstimate.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Billing efficiency is currently holding steady. However, population density growth in {zone.name} is outpacing 
                infrastructure capacity. Forward planning for pipe reinforcement is recommended within the next 18 months.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Document Footer */}
      <footer className="pt-20 pb-10 text-center space-y-4 border-t border-slate-100 print:pt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Aquaflow AI Operational Audit System</p>
        <div className="flex justify-center space-x-6">
           <span className="text-[9px] font-bold text-slate-400">Ref: 2024-MAR-BL-77</span>
           <span className="text-[9px] font-bold text-slate-400">Auth: Municipal Water Board</span>
        </div>
      </footer>

    </div>
  );
};

export default BillingInsights;