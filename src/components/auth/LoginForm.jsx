import { React, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Shield
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [timeoutRemaining, setTimeoutRemaining] = useState(0);

  // Handle retry timeout
  useEffect(() => {
    let interval;
    if (timeoutRemaining > 0) {
      interval = setInterval(() => {
        setTimeoutRemaining(prev => {
          if (prev <= 1) {
            setRetryCount(0);
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeoutRemaining]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
        setRetryCount(prev => {
          const newCount = prev + 1;

          if (newCount >= 3) {
            setError('Too many failed attempts. Please wait before trying again.');
            setTimeoutRemaining(30);
          }

          return newCount;
        });
      } else {
        setRetryCount(0);
        setError('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const isDisabled = loading || retryCount >= 3 || timeoutRemaining > 0;
  const isFormValid = email && password && email.includes('@');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-3 rounded-lg flex items-start space-x-2 ${
              retryCount >= 3
                ? 'bg-orange-500/10 border border-orange-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {retryCount >= 3 ? (
              <Shield className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm ${retryCount >= 3 ? 'text-orange-400' : 'text-red-400'}`}>
                {error}
              </p>
              {timeoutRemaining > 0 && (
                <motion.p
                  className="text-xs mt-1 text-orange-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Try again in {timeoutRemaining} seconds
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <motion.div
          className="relative"
          whileTap={{ scale: 0.995 }}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200"
            required
            disabled={isDisabled}
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          className="relative"
          whileTap={{ scale: 0.995 }}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200"
            required
            disabled={isDisabled}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isDisabled}
            className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
          >
            <motion.div
              whileHover={{ scale: isDisabled ? 1 : 1.1 }}
              whileTap={{ scale: isDisabled ? 1 : 0.9 }}
            >
              {showPassword ?
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" /> :
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              }
            </motion.div>
          </button>
        </motion.div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline disabled:opacity-50"
            disabled={isDisabled}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isFormValid || isDisabled}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            isDisabled || !isFormValid
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50'
          }`}
          whileHover={{ scale: (isDisabled || !isFormValid) ? 1 : 1.02 }}
          whileTap={{ scale: (isDisabled || !isFormValid) ? 1 : 0.98 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </motion.div>
            ) : timeoutRemaining > 0 ? (
              <motion.div
                key="timeout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Locked ({timeoutRemaining}s)</span>
              </motion.div>
            ) : (
              <motion.span
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign In
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </motion.div>
  );
}

export default LoginForm;