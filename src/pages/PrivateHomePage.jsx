import { useAuth } from '../hooks/useAuth'

function PrivateHomePage() {
  const { user } = useAuth();
  return (
    <div style={{padding: '50px', textAlign: 'center'}}>
      <h1>Welcome to Your Dashboard!</h1>
      <p>Hello {user?.email}! This is your private area.</p>
      <p>Only logged-in users can see this.</p>
    </div>
  );
}

export default PrivateHomePage;