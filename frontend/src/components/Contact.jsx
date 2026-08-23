import React, { useState } from 'react';

export default function Contact() {
  const [contactForm, setContactForm] = useState({ clientName: '', endpointEmail: '', queryPayload: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.clientName || !contactForm.endpointEmail) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ clientName: '', endpointEmail: '', queryPayload: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 py-28 border-t border-slate-700 relative w-full">
      <div className="absolute top-[20%] left-[10%] h-[250px] w-[250px] bg-purple-600/5 blur-[100px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Connect with an Infrastructure Specialist.</h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
            Have unique requirements regarding highly scalable architectures or dedicated telemetry proxies? Initialize a connection block and dispatch your system query payload.
          </p>
          
          <div className="mt-8 space-y-4 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
              <span>Secure Tunnel: gateway.nexusai.internal</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Response Window: Less than 4500 CPU ticks</span>
            </div>
          </div>
        </div>

        {/* Terminal Input Card Element */}
        <div className="lg:col-span-6 bg-[#070b19]/95 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden w-full">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-700 pb-4 flex justify-between items-center">
            <span>Secure Mailbox Protocol</span>
            <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded text-brand-primary font-bold">TLS 1.3</span>
          </div>

          {formSubmitted ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center font-mono text-sm text-emerald-400">
              <svg className="w-12 h-12 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Payload dispatched successfully.
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Client Identifier</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.clientName}
                  onChange={(e) => setContactForm({...contactForm, clientName: e.target.value})}
                  placeholder="e.g., Enterprise Lead Dev" 
                  className="w-full bg-[#050918] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Endpoint Destination Email</label>
                <input 
                  type="email" 
                  required
                  value={contactForm.endpointEmail}
                  onChange={(e) => setContactForm({...contactForm, endpointEmail: e.target.value})}
                  placeholder="name@company.com" 
                  className="w-full bg-[#050918] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Query Payload</label>
                <textarea 
                  rows="3"
                  value={contactForm.queryPayload}
                  onChange={(e) => setContactForm({...contactForm, queryPayload: e.target.value})}
                  placeholder="Describe your system data clusters scope..." 
                  className="w-full bg-[#050918] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primary/90 hover:to-indigo-600/90 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-brand-primary/10 active:scale-[0.99] cursor-pointer"
              >
                Dispatch Connection Block
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}