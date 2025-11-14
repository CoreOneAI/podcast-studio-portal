// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Note the .jsx extension

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message || 'Login failed. Check your email and password.');
      setLoading(false);
    } else {
      // Success is handled by the useAuth hook setting user, which triggers the redirect above.
    }
  };

  // Define Tailwind custom colors: Navy Blue (#1A2C42) and Teal (#009688)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 transform hover:shadow-3xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-navy-900">
            Welcome Back!
          </h1>
          <p className="text-teal-500 mt-2 text-lg">Podcast Studio Portal Access</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-4 text-sm bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-teal-500 focus:border-teal-500"
              placeholder="team@podcaststudio.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-teal-500 focus:border-teal-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg shadow-lg text-lg font-semibold text-white transition duration-150 ease-in-out transform 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 hover:scale-[1.01]'}`
            }
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;