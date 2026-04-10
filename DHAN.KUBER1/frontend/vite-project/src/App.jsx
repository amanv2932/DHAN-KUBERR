import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import ScamDetector from "./pages/ScamDetector";
import Optimizer from "./pages/Optimizer";
import Learning from "./pages/Learning";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
        <Route path="/scam" element={<ProtectedRoute><ScamDetector /></ProtectedRoute>} />
        <Route path="/optimizer" element={<ProtectedRoute><Optimizer /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
