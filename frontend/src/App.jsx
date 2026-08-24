import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNexusStore } from './store/nexusStore';

const Navbar = lazy(() => import('./components/Navbar'));
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const About = lazy(() => import('./components/About'));
const Pricing = lazy(() => import('./components/Pricing'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

const CoreAppPreview = lazy(() => import('./components/CoreAppPreview'));
const LiveNetworkMonitor = lazy(() => import('./components/LiveNetworkMonitor'));

// Import Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ModelsPage = lazy(() => import('./pages/ModelsPage'));
const ApiKeysPage = lazy(() => import('./pages/ApiKeysPage'));
const DeployNodeForm = lazy(() => import('./components/DeployNodeForm'));
const FileUpload = lazy(() => import('./components/FileUpload'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
export default function App() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Store se direct authentication state utha li
  const isAuthenticated = useNexusStore((state) => state.isAuthenticated);
  const userRole = useNexusStore((state) => state.userRole);

  const analyticsData = [
    { id: "rev", title: "Total Revenue API", value: "$84,259.00", trend: "↑ +14.2%", isPositive: true, subtext: "vs last month" },
    { id: "usr", title: "Active Nodes", value: "32,481", trend: "↑ +22.8%", isPositive: true, subtext: "real-time synchronization" },
    { id: "cvr", title: "API Endpoint Latency", value: "14ms", trend: "↓ -4.1%", isPositive: false, subtext: "optimized response rate" },
  ];

  const featuresList = [
    { icon: "⚡", title: "Predictive Analytics Architecture", desc: "Advanced algorithmic data indexing structures mapping complex consumer cohorts up to 3 quarters ahead.", premium: true },
    { icon: "🔒", title: "End-to-End Cryptography", desc: "Bank-grade protocol tokens keeping client configuration layers securely containerized and isolated.", premium: false },
    { icon: "🌐", title: "Dynamic Webhook Streaming", desc: "Low-latency streaming channels delivering instantaneous events straight to your application core.", premium: false }
  ];

  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-[#030712] text-slate-300 flex items-center justify-center">Loading…</div>}>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={
          <div className="bg-[#030712] text-slate-200 selection:bg-brand-primary/30 selection:text-white antialiased overflow-x-hidden w-full">
            <Navbar />
            <main className="w-full flex flex-col gap-16">
              <Hero analyticsData={analyticsData} />
              <LiveNetworkMonitor />
              <Features featuresList={featuresList} />
              <About />
              <Pricing />
              <Contact />
            </main>
            <Footer />
          </div>
        } />

        {/* Authentication Pages */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
         
        {/* Public Core Preview Page */}
        <Route path="/core-preview" element={<CoreAppPreview />} />

        {/* Protected Pages */}
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/billing" element={isAuthenticated ? <BillingPage /> : <Navigate to="/login" />} />
        
        <Route path="/deploy-node" element={isAuthenticated ? <DeployNodeForm /> : <Navigate to="/login" />} />
        <Route path="/uploads" element={isAuthenticated ? <FileUpload /> : <Navigate to="/login" />} />
        <Route path="/admin" element={
          isAuthenticated && userRole === 'admin'
            ? <AdminPage />
            : <Navigate to="/dashboard" />
        } />
        {/* Other Pages */}
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/api-keys" element={<ApiKeysPage />} />
        
        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Suspense>
    </Router>
  );
}