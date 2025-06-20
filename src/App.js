import { Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import InactivityModal from './components/ui/InactivityModal';

import { default as Navbar } from './components/navbar'
import { default as Footer } from './components/footer'

import { default as AuthPage } from './pages/Auth'
import { default as Home } from './pages/Home'
import { default as Dashboard } from './pages/Dashboard'
import { default as Memoirs } from './pages/Memoirs'
import { default as Wishlist } from './pages/Wishlist'
import { default as Events } from './pages/Events'
import { default as Friends } from './pages/Friends'
import { default as Settings } from './pages/Settings'

import { useAuth } from './hooks/useAuth'

function App() {
  const { showInactivityModal, handleStillActive, handleInactivityLogout } = useAuth();

  return (
    <ThemeProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/memoirs" element={
            <ProtectedRoute>
              <Memoirs />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/friends" element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>

        <Footer />

        {/* Inactivity Modal */}
        <InactivityModal
          isOpen={showInactivityModal}
          onStillActive={handleStillActive}
          onLogout={handleInactivityLogout}
        />
    </ThemeProvider>
  );
}

export default App;