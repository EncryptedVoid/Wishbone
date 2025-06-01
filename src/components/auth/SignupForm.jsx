import { React, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Calendar,
  Palette,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { supabase } from '../../lib/supabase';

const colorOptions = [
  { id: '', name: 'Choose a color', color: 'bg-gray-200' },
  { id: 'red', name: 'Red', color: 'bg-red-500' },
  { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
  { id: 'green', name: 'Green', color: 'bg-green-500' },
  { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
  { id: 'pink', name: 'Pink', color: 'bg-pink-500' },
  { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
];

function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    dateOfBirth: '',
    favoriteColor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            nickname: formData.nickname,
            date_of_birth: formData.dateOfBirth,
            favorite_color: formData.favoriteColor
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.email && formData.password && formData.confirmPassword &&
                      formData.password === formData.confirmPassword && formData.password.length >= 6;

  const selectedColor = colorOptions.find(option => option.id === formData.favoriteColor) || colorOptions[0];

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
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSignup} className="space-y-4">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Email address"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Create password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ?
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" /> :
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  }
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ?
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" /> :
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  }
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Continue
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Nickname */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => updateField('nickname', e.target.value)}
                  placeholder="Nickname (optional)"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Color Picker */}
              <div className="relative">
                <Listbox value={formData.favoriteColor} onChange={(value) => updateField('favoriteColor', value)}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full pl-10 pr-10 py-3 text-left bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer transition-all duration-200">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Palette className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="block truncate text-gray-900">
                        {selectedColor.name}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className={`w-4 h-4 rounded-full ${selectedColor.color} border border-gray-300`}></div>
                      </span>
                    </Listbox.Button>
                    <Transition
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                        {colorOptions.map((color) => (
                          <Listbox.Option
                            key={color.id}
                            value={color.id}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full ${color.color} border border-gray-300 mr-3`}></div>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {color.name}
                                  </span>
                                </div>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <CheckCircle className="w-4 h-4" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}

export default SignupForm;