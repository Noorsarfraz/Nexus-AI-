import React, { useState } from 'react';
import Button from './Button';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-28 border-t border-slate-700 text-center relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] bg-indigo-900/5 blur-[130px] pointer-events-none"></div>
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Flexible Infrastructure Cost</h2>
      <p className="text-slate-400 mt-3 text-sm">Scale dynamically as your endpoint telemetry grows.</p>
      
      {/* Toggle Switch Component Layout */}
      <div className="flex items-center justify-center gap-3 my-12 bg-slate-950/80 p-2 rounded-full border border-slate-700 w-fit mx-auto shadow-inner">
        <button onClick={() => setIsYearly(false)} className={`text-xs px-5 py-2.5 rounded-full transition duration-300 font-semibold cursor-pointer ${!isYearly ? 'text-white bg-slate-800 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>Monthly Node Cycle</button>
        <button onClick={() => setIsYearly(true)} className={`text-xs px-5 py-2.5 rounded-full transition duration-300 font-semibold flex gap-2 items-center cursor-pointer ${isYearly ? 'text-white bg-slate-800 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>Yearly Pipeline <span className="bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full text-[9px] font-black">Save 20%</span></button>
      </div>

      {/* Pricing Architecture Card */}
      <div className="max-w-md mx-auto p-6 sm:p-10 rounded-3xl border border-brand-primary/40 bg-[#060b1e]/50 backdrop-blur-md text-left relative shadow-2xl group hover:border-brand-primary/70 transition-all duration-300">
        <span className="absolute -top-3 left-8 bg-gradient-to-r from-brand-primary to-violet-600 text-white text-[10px] font-black tracking-widest px-4 py-1 rounded-full uppercase shadow-md">Enterprise Selected</span>
        
        <div className="text-2xl font-black text-white tracking-tight">Production Node Plan</div>
        <p className="text-slate-400 mt-1 text-xs">For high-throughput continuous pipelines</p>
        
        <div className="my-8 flex flex-col border-y border-slate-700 py-6">
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-5xl sm:text-6xl font-black tracking-tighter transition-all duration-300">${isYearly ? '151' : '189'}</span>
            <span className="text-slate-400 text-sm font-medium">/mo</span>
          </div>
          <span className="text-xs text-brand-accent mt-2 font-mono">
            {isYearly ? 'billed annually ($1,812/yr) • 20% discount applied' : 'billed monthly • switch to yearly to save $456'}
          </span>
        </div>
        
        <Button variant="primary" className="w-full text-center shadow-md shadow-brand-primary/10 py-3">Activate Secure Pipeline</Button>
        
        <ul className="mt-8 space-y-4 text-slate-300 text-sm font-medium">
          {[ "Infinite real-time database endpoints", "30-day continuous logging ledger", "Integrated secure webhook streams", "Custom REST/GraphQL telemetry nodes" ].map((item) => (
             <li key={item} className="flex items-center gap-3">
               <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
               {item}
             </li>
          ))}
        </ul>
      </div>
    </section>
  );
}