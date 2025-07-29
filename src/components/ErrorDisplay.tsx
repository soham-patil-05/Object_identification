import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-2xl font-semibold text-slate-800 mb-4">
        Analysis Failed
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
        {error}
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        
        <div className="text-sm text-slate-500 max-w-md mx-auto">
          <p className="mb-2">Tips for better results:</p>
          <ul className="text-left space-y-1">
            <li>• Ensure good lighting</li>
            <li>• Keep the object clearly visible</li>
            <li>• Try a different angle or distance</li>
            <li>• Make sure your internet connection is stable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;