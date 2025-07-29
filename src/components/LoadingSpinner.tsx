import React from 'react';
import { Zap } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        
        {/* Spinning ring */}
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Inner icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-white animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-2 mt-6">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;