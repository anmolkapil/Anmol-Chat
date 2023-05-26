import './Navbar.css';

import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useAuth();
  return (
    <div className="navbar">
      <span className="logo">AnmolChat 💬</span>
      <div className="currentUser">
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
