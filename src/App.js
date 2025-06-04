import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Assets from './components/Assets';
import FinancialGoals from './components/FinancialGoal';
import Result from './components/Result';
import Login from './components/Login';
import VerifyEmail from './components/VerifyEmail';
import Chatbot from './components/Chatbot';


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-dark-blue text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/financial-goals" element={<FinancialGoals />} />
          <Route path="/login" element={<Login />} />
          <Route path="/result" element={<Result/>} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
