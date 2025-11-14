// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// CRUCIAL FIXES: All component imports must use the .jsx extension
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; 
// FIX: Changed import from Sidebar.js to Sidebar.jsx
import Sidebar from './components/navigation/Sidebar.jsx'; 

// Pages (all renamed to .jsx)
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import ProjectForm from './pages/ProjectForm.jsx';
import GuestManagement from './pages/GuestManagement.jsx';
import AIChatAssistant from './pages/AIChatAssistant.jsx';


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
      {/* Sidebar Component */}
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