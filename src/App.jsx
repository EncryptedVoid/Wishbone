import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { default as AuthPage } from './pages/Auth'
import { default as Home } from './pages/Home'
import { default as Navbar } from './components/navbar'
import { default as Dashboard } from './pages/Dashboard'
import { default as Footer } from './pages/Footer'
import { default as Memoirs } from './pages/Memoirs'
import { default as Wishlist } from './pages/Wishlist'
import { default as Events } from './pages/Events'
import { default as Friends } from './pages/Friends'
import { default as Settings } from './pages/Settings'

function App() {
  return (
    <>
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
    </>
  );
}

export default App;