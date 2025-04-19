import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import './index.css'; // or wherever your global styles live
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Goals from "./pages/Goals";
import Learn from "./pages/Learn";
import GeminiChatBot from "./pages/GeminiChatBot";
import Settings from "./pages/Settings";
import StockPrices from "./pages/StockPrices";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/geminichatbot" element={<GeminiChatBot />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stockprices" element={<StockPrices />} />
        </Routes>
      </div>
    </Router>
  );
}
