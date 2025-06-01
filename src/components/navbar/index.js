import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

function Navbar() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleAuthClick = async () => {
        if (user) {
            try {
                await supabase.auth.signOut();
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Error signing out:', error);
            }
        } else {
            navigate('/auth');
        }
    };

    const handleNavClick = (path) => {
        navigate(path);
    };

    // Don't render navigation items while loading
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <nav className="navbar">
            <button
                onClick={() => handleNavClick(user ? '/dashboard' : '/')}
                className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
                HOME
            </button>

            {user && (
                <>
                    <Link
                        to="/memoirs"
                        className={`nav-item ${location.pathname === '/memoirs' ? 'active' : ''}`}
                    >
                        MEMOIRS
                    </Link>
                    <Link
                        to="/wishlist"
                        className={`nav-item ${location.pathname === '/wishlist' ? 'active' : ''}`}
                    >
                        WISHLIST
                    </Link>
                    <Link
                        to="/events"
                        className={`nav-item ${location.pathname === '/events' ? 'active' : ''}`}
                    >
                        EVENTS
                    </Link>
                    <Link
                        to="/friends"
                        className={`nav-item ${location.pathname === '/friends' ? 'active' : ''}`}
                    >
                        FRIENDS
                    </Link>
                    <Link
                        to="/settings"
                        className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
                    >
                        SETTINGS
                    </Link>
                </>
            )}

            <button
                onClick={handleAuthClick}
                className="auth-button"
                disabled={loading}
            >
                {user ? 'Logout' : 'Login'}
            </button>
        </nav>
    );
}

export default Navbar;