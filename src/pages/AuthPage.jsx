import { useState } from 'react'
import { supabase } from '../lib/supabase'

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else window.location.href = '/dashboard'; // Redirect after login
  };

  return (
    <div style={{maxWidth: '400px', margin: '100px auto'}}>
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} style={{display: 'block', margin: '10px 0', padding: '10px', width: '100%'}} />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} style={{display: 'block', margin: '10px 0', padding: '10px', width: '100%'}} />
        <button type="submit" style={{padding: '10px', width: '100%'}}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} style={{marginTop: '10px'}}>
        {isSignUp ? 'Already have account? Login' : 'Need account? Sign Up'}
      </button>
    </div>
  );
}

export default AuthPage;