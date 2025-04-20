import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Goals from './pages/Goals';
import Learn from './pages/Learn';
import GeminiChatBot from './pages/GeminiChatBot';
import Settings from './pages/Settings';
import StockPrices from './pages/StockPrices';
import Register from './pages/Register';
import Login from './pages/Login';
import { useDispatch, useSelector } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { RootState } from './store/store';

export default function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/geminichatbot" element={<GeminiChatBot />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stockprices" element={<StockPrices />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
