import './LoginPage.css';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signInWithGoogle } from '../../firebase';

const LoginPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // User is already signed in, redirect to '/'
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h1>AnmolChat 💬</h1>
        <GoogleLoginButton handleClick={signInWithGoogle} />
      </div>
    </div>
  );
};

export default LoginPage;
