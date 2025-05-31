import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { LoginPage, SignupPage, ResetPasswordPage, HomePage, WishlistPage, SettingsPage } from './pages'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/reset-password" element={<ResetPasswordPage />}/>
          <Route path="/*" element={
            <ProtectedRoute>
              <Route path="/" element={<HomePage />}/>
              <Route path="/wishlist" element={<WishlistPage />}/>
              <Route path="/settings" element={<SettingsPage />}/>
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
      <div>NAVBAR</div>
      <div>BODY</div>
      <div>FOOTER</div>
    </div>
  );
}

export default App;
