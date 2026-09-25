import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverProjectsPage } from './pages/DiscoverProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { FindTeammatesPage } from './pages/FindTeammatesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { MyInvitationsPage } from './pages/MyInvitationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0518] flex flex-col items-center justify-center text-slate-300 text-sm font-medium">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_#c084fc]"></div>
        Loading Project Forge...
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App Layout Wrapper
const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0518] flex flex-col items-center justify-center text-slate-300 text-sm font-medium">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_#c084fc]"></div>
        Initializing Project Forge...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0518] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex w-full z-10">
        {isAuthenticated && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full z-10 relative">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
            
            {/* Authenticated Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><DiscoverProjectsPage /></ProtectedRoute>} />
            <Route path="/projects/create" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>} />
            <Route path="/teammates" element={<ProtectedRoute><FindTeammatesPage /></ProtectedRoute>} />
            <Route path="/users/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/invitations" element={<ProtectedRoute><MyInvitationsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {!isAuthenticated && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(23, 14, 44, 0.95)',
                color: '#f3e8ff',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                borderRadius: '16px',
                fontSize: '14px',
                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
          <AppLayout />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


