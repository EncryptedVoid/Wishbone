import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { default as AuthPage } from './pages/Auth'
import { default as Home } from './pages/Home'
import { default as Navbar } from './components/navbar'
import { default as Dashboard } from './pages/Dashboard'
import { default as Footer } from './pages/Footer'


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
