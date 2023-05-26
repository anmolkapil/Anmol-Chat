import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ChatPage from './pages/ChatPage/ChatPage';

import { useAuth } from './context/AuthContext';

import './styles.css';

const App = () => {
  const { currentUser } = useAuth();
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
