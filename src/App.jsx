import './App.css';
import { supabase } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
// import { LoginPage, SignupPage, ResetPasswordPage, HomePage, WishlistPage, SettingsPage } from './pages'
import { default as AuthPage } from './pages/Auth'
import { default as PublicHomePage } from './pages/PublicHomePage'
import { default as PrivateHomePage } from './pages/PrivateHomePage'


function App() {
  const { user, loading } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      // User is logged in, so logout
      supabase.auth.signOut();
    } else {
      // User not logged in, go to auth page
      window.location.href = '/auth';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* The login/logout button */}
      <button onClick={handleAuthClick} style={{padding: '10px 20px', margin: '20px'}}>
        {user ? 'Logout' : 'Login'}
      </button>

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PrivateHomePage />
          </ProtectedRoute>
        } />
        <Route path="/*" element={<PublicHomePage />} />
      </Routes>
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
