import React from 'react';

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-28 border-t border-slate-700 relative w-full">
      <div className="text-center max-w-3xl mx-auto mb-16 px-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Our Core Framework Philosophy</h2>
        <p className="text-slate-400 mt-4 text-sm sm:text-base">We design modular node systems optimized for concurrent enterprise operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento Box 1: Sub-14ms Target (Watermark removed) */}
        <div className="md:col-span-7 bg-[#060b1e]/40 border border-slate-700 p-6 sm:p-8 rounded-3xl relative overflow-hidden group hover:border-slate-500 transition-all duration-300">
          <h3 className="text-lg font-bold text-white tracking-tight">The Sub-14ms Benchmark</h3>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-md">
            Every system core layer is engineered using isolated vector configurations. This setup mitigates stack accumulation latency overhead entirely.
          </p>
        </div>

        {/* Bento Box 2: Automated Indexing */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0c122c]/60 to-[#060b1e]/40 border border-slate-700 p-6 sm:p-8 rounded-3xl hover:border-slate-500 transition-all duration-300">
          <h3 className="text-lg font-bold text-white tracking-tight">Autonomous Ecosystems</h3>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            We eliminate sequential indexing bottlenecks natively. Automated pipelines structure clean production data flows in real-time.
          </p>
        </div>

        {/* Bento Box 3: Modular Containers */}
        <div className="md:col-span-5 bg-[#060b1e]/40 border border-slate-700 p-6 sm:p-8 rounded-3xl hover:border-slate-500 transition-all duration-300">
          <h3 className="text-lg font-bold text-white tracking-tight">Dynamic Containerization</h3>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Security parameters are deeply integrated within the node framework, ensuring absolute database thread isolation.
          </p>
        </div>

        {/* Bento Box 4: Global Streaming Channels */}
        <div className="md:col-span-7 bg-slate-950/40 border border-slate-700 p-6 sm:p-8 rounded-3xl relative overflow-hidden group hover:border-slate-500 transition-all duration-300">
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-primary/10 rounded-full blur-xl group-hover:bg-brand-primary/20 transition-all"></div>
          <h3 className="text-lg font-bold text-white tracking-tight">Distributed Microarchitecture</h3>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-lg">
            Through low-latency webhook tunnels, our platform distributes concurrent configuration layers globally without data replication lag.
          </p>
        </div>
      </div>
    </section>
  );
}