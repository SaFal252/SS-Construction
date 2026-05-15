import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify-email/${token}/`);
        setStatus('success');
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.detail || 'Invalid or expired verification link.'
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700 text-center">
        {status === 'loading' && <p className="text-gray-400">Verifying your email...</p>}
        {status === 'success' && (
          <p className="text-green-500">
            ✅ {message} Redirecting to login...
          </p>
        )}
        {status === 'error' && (
          <div>
            <p className="text-red-500">❌ {message}</p>
            <button
              onClick={() => navigate('/signup')}
              className="mt-4 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#DAA520]"
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;