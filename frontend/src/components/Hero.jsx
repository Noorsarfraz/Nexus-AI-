import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, X } from 'lucide-react';
import Button from './Button';
import Metrics from './Metrics';
import heroIllustration from '../assets/hero-illustration.png';
import heroIllustrationWebp from '../assets/hero-illustration.webp';

export default function Hero({ analyticsData }) {
  const navigate = useNavigate();
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);

  // Component load hotay hi page ko bilkul top par le aane ke liye
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <section className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-16 sm:pt-28 pb-16 flex flex-col items-center justify-center overflow-hidden w-full">
      
      {/* Fine Cyber Grid Graphic Layer */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_80%,transparent_100%)]"></div>
      
      {/* Layered High-End Ambient Lighting */}
      <div className="absolute top-[-5%] left-1/4 h-[350px] w-[350px] bg-brand-primary/15 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[15%] right-10 h-[300px] w-[300px] bg-purple-600/10 blur-[100px] pointer-events-none"></div>

      {/* Main Grid: Scalable Side-by-Side on both Mobile & Desktop */}
      <div className="grid grid-cols-12 gap-3 sm:gap-6 lg:gap-12 items-center w-full relative z-10 py-4">
        
        {/* Left Column: Scalable Text Content */}
        <div className="col-span-7 lg:col-span-6 flex flex-col items-start text-left">
          
          {/* Floating Glass Component Badge */}
          <div className="inline-flex items-center gap-1.5 bg-slate-950/45 backdrop-blur-md text-slate-300 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold mb-3 border border-slate-800/60 shadow-sm">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-brand-primary"></span>
            </span>
            <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent truncate">Nexus Terminal</span>
            <span className="text-[9px] bg-brand-primary text-white px-1 rounded font-mono">v4.2</span>
          </div>
          
          {/* Scalable Heading for Mobile and Laptop */}
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Architect your metrics in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-indigo-400 to-purple-400">real-time</span> with AI nodes.
          </h1>
          
          <p className="mt-2.5 text-[11px] sm:text-sm md:text-base text-slate-400 max-w-lg leading-relaxed">
            Say goodbye to sluggish databases. Seamlessly link production servers and let automated intelligence construct clean data maps natively.
          </p>
          
          {/* Scalable Call to Actions with Navigation and Modal Triggers */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2.5 w-full">
            <div onClick={() => navigate('/core-preview')} className="w-full sm:w-auto cursor-pointer">
              <Button variant="primary" className="w-full sm:w-auto px-3.5 py-2 text-[11px] sm:text-sm shadow-md shadow-brand-primary/20 justify-center">Initialize Core App</Button>
            </div>
            <div onClick={() => setShowBlueprintModal(true)} className="w-full sm:w-auto cursor-pointer">
              <Button variant="secondary" className="w-full sm:w-auto px-3.5 py-2 text-[11px] sm:text-sm border-slate-800 bg-slate-900/30 text-slate-300 hover:bg-slate-900 justify-center">Inspect Blueprint</Button>
            </div>
          </div>
        </div>

        {/* Right Column: Scalable Image */}
        <div className="col-span-5 lg:col-span-6 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712] z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[#030712]/40 rounded-3xl blur-2xl pointer-events-none"></div>

          <div className="relative w-full overflow-hidden p-0 bg-transparent">
            <picture>
              <source srcSet={heroIllustrationWebp} type="image/webp" />
              <img 
                src={heroIllustration} 
                alt="Nexus AI Architecture Network" 
                width="700"
                height="341"
                className="w-full h-auto object-contain opacity-95 hover:opacity-100 transition-opacity duration-500 [mask-image:radial-gradient(circle_at_center,black_50%,transparent_90%)] filter blur-[0.3px] saturate-125"
              />
            </picture>
          </div>
        </div>

      </div>

      {/* Metrics / Interactive Dashboard */}
      <div className="w-full mt-10 sm:mt-16">
        <Metrics analyticsData={analyticsData} />
      </div>

      {/* Inspect Blueprint Modal */}
      {showBlueprintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-left space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" /> System Blueprint & Architecture
              </h3>
              <button 
                onClick={() => setShowBlueprintModal(false)} 
                className="text-slate-400 hover:text-white text-lg p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Nexus-AI enterprise architecture breakdown, featuring decentralized clustering and secure JWT session routing.
            </p>
            
            {/* SaaS Detailed Blueprint Sections */}
            <div className="space-y-3 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
              
              <div className="border-b border-slate-800 pb-2.5">
                <span className="text-indigo-400 font-bold">📂 1. Core Architecture & Frontend</span>
                <p className="mt-1">• Framework: React + Vite + Tailwind CSS (Responsive UI)</p>
                <p>• Routing & State: React Router DOM, Session Storage Sync</p>
              </div>

              <div className="border-b border-slate-800 pb-2.5">
                <span className="text-violet-400 font-bold">🔐 2. Security & SaaS Authentication</span>
                <p className="mt-1">• Auth Flow: Node.js + Express + JWT Token Validation</p>
                <p>• Data Protection: Isolated user session routing per profile email</p>
              </div>

              <div className="border-b border-slate-800 pb-2.5">
                <span className="text-emerald-400 font-bold">⚡ 3. AI & Telemetry Engine</span>
                <p className="mt-1">• Node Orchestration: Autonomous edge clustering</p>
                <p>• Live Monitoring: Real-time latency tracking & metrics stream</p>
              </div>

              <div>
                <span className="text-amber-400 font-bold">🚀 4. Deployment & Scalability</span>
                <p className="mt-1">• Cloud Distribution: Multi-region container ready</p>
                <p>• API Integration: Secure RESTful endpoints for enterprise scaling</p>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowBlueprintModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition cursor-pointer border border-slate-700"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}