import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

function Navbar() {
      const { user, loading } = useAuth();

    const handleAuthClick = () => {
        if (user) {
            // User is logged in, so logout
            supabase.auth.signOut();
            window.location.href = '/';
        } else {
            // User not logged in, go to auth page
            window.location.href = '/auth';
        }
    };

    return (
        <>
            {<div>HOME</div>}
            {user ? <div>MEMOIRS</div> : <div></div>}
            {user ? <div>WISHLIST</div> : <div></div>}
            {user ? <div>EVENTS</div> : <div></div>}
            {user ? <div>FRIENDS</div> : <div></div>}
            {user ? <div>SETTINGS</div> : <div></div>}

            <button onClick={handleAuthClick} style={{padding: '10px 20px', margin: '20px'}}>
                {user ? 'Logout' : 'Login'}
            </button>
        </>
    )
}

export default Navbar;