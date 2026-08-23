import React from 'react';

export default function Button({ children, variant = 'primary', onClick, className = '' }) {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 text-sm active:scale-98 select-none cursor-pointer inline-flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-primary to-violet-600 text-white shadow-xl shadow-brand-primary/20 hover:opacity-95 hover:shadow-brand-primary/30",
    secondary: "bg-slate-900/80 backdrop-blur border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/50"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}