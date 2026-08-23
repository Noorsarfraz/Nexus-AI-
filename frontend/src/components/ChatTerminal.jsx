import React, { useState, useRef, useEffect } from 'react';

export default function ChatTerminal({ messages, setMessages, isTyping, setIsTyping, analyticsData = [] }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input.trim();
    const userMessage = { id: Date.now(), text: userQuery, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "";
      const lowerQuery = userQuery.toLowerCase();

      // Specific single query matching for realistic chatbot behavior
      const matchedNode = analyticsData.find(item => 
        lowerQuery.includes(item.title.toLowerCase()) || 
        (lowerQuery.includes('revenue') && item.title.toLowerCase().includes('revenue')) ||
        (lowerQuery.includes('node') && item.title.toLowerCase().includes('nodes')) ||
        (lowerQuery.includes('latency') && item.title.toLowerCase().includes('latency'))
      );

      if (matchedNode) {
        botReply = `📌 **${matchedNode.title}**: ${matchedNode.value} (${matchedNode.trend} ${matchedNode.subtext})`;
      } else if (lowerQuery.includes('all') || lowerQuery.includes('status') || lowerQuery.includes('metrics')) {
        botReply = "📊 **Current System Telemetry:**\n" + analyticsData.map(item => `• ${item.title}: ${item.value}`).join('\n');
      } else {
        const botReplies = [
          "Telemetry sync complete. Vector nodes running at optimal baseline latency.",
          "Security layers verification: All containerized proxy protocol blocks are isolated.",
          "Revenue ingestion stream optimized. Sub-node pipeline processing matches targets.",
          "Query executed. Application core streaming live events via active webhooks."
        ];
        botReply = botReplies[Math.floor(Math.random() * botReplies.length)];
      }
      
      setMessages((prev) => [...prev, { id: Date.now(), text: botReply, isBot: true }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="bg-[#070b19] border border-slate-700/60 shadow-xl rounded-2xl p-4 sm:p-5 mt-4 flex flex-col h-[320px]">
      <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between border-b border-slate-800/80 pb-2">
        <span className="font-semibold text-slate-300">Interactive Query Terminal</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-normal">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Connected
        </span>
      </div>
      
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 mb-3 flex flex-col scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] px-3.5 py-2 rounded-xl text-xs sm:text-sm leading-relaxed border whitespace-pre-line ${
              msg.isBot 
                ? 'bg-[#0c122c] border-slate-700/60 text-slate-300 rounded-tl-none shadow-sm' 
                : 'bg-gradient-to-r from-brand-primary to-violet-600 border-brand-primary/20 text-white rounded-tr-none shadow-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#0c122c] border border-slate-700/60 text-slate-500 px-3 py-1.5 rounded-xl rounded-tl-none text-xs flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSendMessage} className="flex gap-2.5 mt-auto pt-2 border-t border-slate-800/80">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about specific nodes (e.g., revenue, nodes, latency)..." 
          className="flex-1 bg-[#040612] border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-colors shadow-inner"
        />
        <button 
          type="submit" 
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-md shadow-brand-primary/20"
        >
          Send Node
        </button>
      </form>
    </div>
  );
}