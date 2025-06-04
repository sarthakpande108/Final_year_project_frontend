import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/verify-email?token=${token}`);
          const data = await response.json();

          if (response.ok) {
            setVerificationStatus('success');
            setUserData({ email: data.email, userId: data.userId });

            localStorage.setItem('userId', data.userId);
            localStorage.setItem('email', data.email);

            setTimeout(() => {
              navigate(`/profile?userId=${data.userId}&email=${data.email}`);
            }, 2000);
          } else {
            setVerificationStatus('failed');
          }
        } catch (error) {
          console.error('Verification failed:', error);
          setVerificationStatus('failed');
        }
      };

      verifyEmail();
    } else {
      setVerificationStatus('failed');
    }
  }, [token, navigate,API_BASE_URL]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="h-52 w-full max-w-md bg-gray-800 p-6 rounded-lg text-center flex flex-col items-center justify-center">
        {verificationStatus === 'success' ? (
          <>
            <p className="text-green-400 mb-4">Your email has been successfully verified!</p>
            <p>Redirecting to profile...</p>
          </>
        ) : verificationStatus === 'failed' ? (
          <p className="text-red-500">Email verification failed. Please try again or contact support.</p>
        ) : (
          <p>Verifying your email...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;







  
  