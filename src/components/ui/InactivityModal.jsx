import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Adjust import path as needed
import Button from './Button'; // Adjust import path as needed

const InactivityModal = ({ isOpen, onStillActive, onLogout }) => {
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown

  useEffect(() => {
    if (!isOpen) {
      setCountdown(60);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Time's up, auto logout
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onLogout]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => {}} className="inactivity-modal">
      <div className="text-center p-6">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Still there?
          </h3>
          <p className="text-gray-600 mb-4">
            You've been inactive for a while. For security purposes, you'll be automatically signed out in:
          </p>
          <div className="text-3xl font-bold text-red-600 mb-6">
            {countdown}s
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={onStillActive}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Yes, I'm still here
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium"
          >
            Sign me out
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InactivityModal;