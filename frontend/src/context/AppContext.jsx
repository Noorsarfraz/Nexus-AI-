import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Jo data aapne App.jsx mein rakha tha, use yahan global state bana diya
  const [analyticsData, setAnalyticsData] = useState([
    { id: "rev", title: "Total Revenue API", value: "$84,259.00", trend: "↑ +14.2%", isPositive: true, subtext: "vs last month" },
    { id: "usr", title: "Active Nodes", value: "32,481", trend: "↑ +22.8%", isPositive: true, subtext: "real-time synchronization" },
    { id: "cvr", title: "API Endpoint Latency", value: "14ms", trend: "↓ -4.1%", isPositive: false, subtext: "optimized response rate" },
  ]);

  const [featuresList, setFeaturesList] = useState([
    { icon: "⚡", title: "Predictive Analytics Architecture", desc: "Advanced algorithmic data indexing structures mapping complex consumer cohorts up to 3 quarters ahead.", premium: true },
    { icon: "🔒", title: "End-to-End Cryptography", desc: "Bank-grade protocol tokens keeping client configuration layers securely containerized and isolated.", premium: false },
    { icon: "🌐", title: "Dynamic Webhook Streaming", desc: "Low-latency streaming channels delivering instantaneous events straight to your application core.", premium: false }
  ]);

  // 2. Loading aur Empty states ke liye variables
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ analyticsData, setAnalyticsData, featuresList, setFeaturesList, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);