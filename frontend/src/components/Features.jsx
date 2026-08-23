import React from 'react';

export default function Features({ featuresList }) {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-24 border-t border-slate-800/80 relative w-full">
      {/* Background Glow */}
      <div className="absolute bottom-[10%] right-[5%] h-[350px] w-[350px] bg-brand-primary/5 blur-[120px] pointer-events-none"></div>
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-2">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Engineered for low-latency scale.
        </h2>
        <p className="text-slate-400 mt-4 text-xs sm:text-base md:text-lg">
          No unnecessary bloated packages. Just pure, native performance mapping layouts.
        </p>
      </div>
      
      {/* Properly Aligned 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {featuresList && featuresList.map((item, index) => (
          <div 
            key={index} 
            className="p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl hover:border-brand-primary/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/15 to-transparent text-brand-primary flex items-center justify-center font-bold mb-6 text-xl border border-brand-primary/20 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                {item.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{item.title}</h3>
              
              {/* Description */}
              <p className="text-slate-400 mt-3 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>

            {/* Subtle bottom highlight line on hover */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
}