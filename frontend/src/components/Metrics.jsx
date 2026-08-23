import React, { useState } from 'react';
import ChatTerminal from './ChatTerminal';

export default function Metrics({ analyticsData }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "System initialized. Dynamic node stream active. Ask me anything about your platform telemetry.", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 mt-8 px-4 sm:px-0">
      
      {/* SECTION 1: Compact Metrics Cards Box */}
      <div id="metrics" className="relative w-full rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 sm:p-4 shadow-xl backdrop-blur-xl">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-brand-primary via-violet-500 to-emerald-500 opacity-15 blur-md pointer-events-none"></div>

        <div className="w-full bg-[#070b19]/95 border border-slate-900/80 rounded-xl p-4 sm:p-5 flex flex-col gap-4 text-left relative z-10">
          
          {/* Top Chrome Window Panel Controls */}
          <div className="flex items-center justify-between border-b border-slate-900/80 pb-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-full"></span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 px-3 py-0.5 rounded-full border border-slate-800/40">terminal-node-stream.json</div>
            <div className="w-6 h-1 bg-slate-800 rounded-full"></div>
          </div>
          
          {/* Analytics Grid Cards (Compact) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.map((node) => (
              <div key={node.id} className="p-4 bg-[#0c122c]/50 rounded-xl border border-slate-800/40 hover:border-brand-primary/30 transition-all duration-300 shadow-md group/card">
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{node.title}</div>
                <div className="text-2xl font-black text-white mt-1 tracking-tight">{node.value}</div>
                <div className={`text-[11px] ${node.isPositive ? 'text-emerald-400' : 'text-rose-400'} mt-2 font-medium flex items-center gap-1.5`}>
                  {node.trend}
                  <span className="text-slate-500 font-normal">{node.subtext}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* SECTION 2: Compact Chat Terminal */}
      <div className="w-full">
        <ChatTerminal 
          messages={messages} 
          setMessages={setMessages} 
          isTyping={isTyping} 
          setIsTyping={setIsTyping}
          analyticsData={analyticsData}
        />
      </div>

    </div>
  );
}