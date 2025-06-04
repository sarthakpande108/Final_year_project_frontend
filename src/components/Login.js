import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaTimes } from 'react-icons/fa';
import { notification } from 'antd'; // Import Ant Design notification
import 'antd/dist/reset.css'; // Import Ant Design styles

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      await sendVerificationLink();
    } else {
      await signIn();
    }

    setIsLoading(false);
  };

  const sendVerificationLink = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error occurred');
      }

      // Show success notification and redirect to home page after 5 seconds
      notification.success({
        message: 'Verification Email Sent',
        description: 'A verification email has been sent to your inbox. Redirecting you to the home page...',
        duration: 5, // Auto close after 5 seconds
        onClose: () => {
          navigate('/');
          onClose(); // Close the login popup
        },
      });
    } catch (error) {
      console.error('Error sending verification link:', error);
      notification.error({
        message: 'Error',
        description: `Error sending verification link: ${error.message}`,

      });
    }
  };

  const signIn = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error occurred');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      navigate('/profile');
      onClose(); // Close the login popup
    } catch (error) {
      console.error('Error signing in:', error);
      notification.error({
        message: 'Error',
        description:` Error signing in: ${error.message}`,
      });
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google");
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md relative">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-white" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {isSignUp ? 'Sign In' : 'LOGIN'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold w-full py-3 rounded ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
              </div>
            )}
            {isLoading ? 'Please wait...' : isSignUp ? 'Sign In' : 'Login'}
          </button>
        </form>
        <div className="border-t border-gray-700 my-4"></div>
        <h3 className="text-xl font-bold text-white mb-4">Or sign in with</h3>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded-md w-full flex items-center justify-center mb-2 hover:bg-red-600"
        >
          <FaGoogle className="mr-2" /> Sign in with Google
        </button>
        <div className="text-center text-white mt-4">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-400"
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-400"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;