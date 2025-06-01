import { useState } from 'react'
import { default as LoginForm } from '../../components/auth/LoginForm'
import { default as SignupForm } from '../../components/auth/SignupForm'

function AuthPageDesktop() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-20">
        <div className="mx-auto max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-white rounded-xl"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome to Our Platform
            </h1>
            <p className="text-lg text-purple-200 leading-relaxed">
              Join thousands of users who trust our platform for their daily workflow.
              Experience seamless integration and powerful features designed for modern teams.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-purple-100">Advanced security & encryption</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-purple-100">Lightning fast performance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span className="text-purple-100">24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-purple-200">
                {isSignUp ? 'Join our community today' : 'Sign in to your account'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-white/10 rounded-2xl p-1 mb-8 backdrop-blur-sm">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  !isSignUp
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isSignUp
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Container with Slide Animation */}
            <div className="relative overflow-hidden mb-8 min-h-[450px]">
              <div
                className={`transition-transform duration-500 ease-in-out ${
                  isSignUp ? '-translate-x-full' : 'translate-x-0'
                }`}
              >
                <div className="flex">
                  <div className="w-full flex-shrink-0">
                    <div className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder-purple-200 [&_input:focus]:ring-white/30 [&_input:focus]:border-white/40 [&_button]:bg-white/10 [&_button]:border-white/20 [&_button]:text-white [&_div]:text-white [&_span]:text-purple-200">
                      <LoginForm />
                    </div>
                  </div>
                  <div className="w-full flex-shrink-0 pl-8">
                    <div className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder-purple-200 [&_input:focus]:ring-white/30 [&_input:focus]:border-white/40 [&_button]:bg-white/10 [&_button]:border-white/20 [&_button]:text-white [&_div]:text-white [&_span]:text-purple-200">
                      <SignupForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Login */}
            {/* <div>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 text-purple-200 backdrop-blur-sm rounded-full">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="w-full flex justify-center py-3 px-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button className="w-full flex justify-center py-3 px-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.219.083.338-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.756-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="mt-8 text-center">
              <p className="text-xs text-purple-300">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPageDesktop;