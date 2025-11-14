// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProjectDetails from './pages/ProjectDetails';
import ProjectForm from './pages/ProjectForm';
import GuestManagement from './pages/GuestManagement';
import AIChatAssistant from './pages/AIChatAssistant';
// Components
import Sidebar from './components/navigation/Sidebar';

// --- Private Route Component ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show a basic loading state while checking auth
    return <div className="p-8 text-center text-gray-500">Loading authentication...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// --- Main Layout (Sidebar integration) ---
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component: We'll style this with your Navy Blue theme */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

// --- App Component with Router and Context ---
function App() {
  return (
    <Router>
      {/* Wrap the entire app with the AuthProvider */}
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Require Login) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/new" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectForm />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/guests" 
            element={
              <ProtectedRoute>
                <Layout>
                  <GuestManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-chat" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AIChatAssistant />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;