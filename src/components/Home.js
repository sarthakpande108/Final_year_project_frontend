import React, { useState }  from 'react';
import Typewriter from 'typewriter-effect';
import { useNavigate } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import Login from './Login';

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const handleLogin = () => {
    setShowLogin(true);
  };
  const handleChatbot=()=> {
    navigate('/Chatbot');
  }

  return (
    <div
  className="flex flex-col min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('/img/27230.jpg')" }}
>

      <div className="flex-grow flex items-center justify-center bg-black bg-opacity-0 p-12">
        <div className="text-center max-w-4xl mx-auto">
        <div className="text-4xl md:text-6xl font-bold mb-6 text-white">
          <h1>Introducing </h1>
            <span style={{
              background: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
            <Typewriter
              options={{
              strings: ['FinAI Planner'],
              autoStart: true,
              loop: true,
            }}
            />
          </span>   
        </div>

          <p className="text-lg md:text-xl mb-8 text-white mx-auto">
          Empowering Your Financial Future with GenAI: Smart Plans, Tailored for You
          </p>
          <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded"
              onClick={handleLogin}
             >
              Continue
            </button >
        </div>
      </div>
      <footer className="flex items-center justify-center text-center p-4 bg-black" style={{ height: '60px' }}>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white font-semibold opacity-50">
        </p>
      </footer>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}

    </div>
  );
};

export default Home;
