import './App.css';
import { supabase } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
// import { LoginPage, SignupPage, ResetPasswordPage, HomePage, WishlistPage, SettingsPage } from './pages'
import { default as AuthPage } from './pages/Auth'
import { default as Home } from './pages/Home'
import { default as Navbar } from './components/navbar'
import { default as Dashboard } from './pages/Dashboard'


function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>FOOTER</div>
    </>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           <Route path="/login" element={<LoginPage />}/>
//           <Route path="/signup" element={<SignupPage />}/>
//           <Route path="/reset-password" element={<ResetPasswordPage />}/>
//           <Route path="/*" element={
//             <ProtectedRoute>
//               <Route path="/" element={<HomePage />}/>
//               <Route path="/wishlist" element={<WishlistPage />}/>
//               <Route path="/settings" element={<SettingsPage />}/>
//               <div>PROTECTED NAVBAR</div>
//               <div>PROTECTED BODY</div>
//               <div>PROTECTED FOOTER</div>
//             </ProtectedRoute>
//           }/>
//         </Routes>
//       </Router>

//       <div>NAVBAR</div>
//       <div>BODY</div>
//       <div>FOOTER</div>

//     </div>
//   );
// }

export default App;
