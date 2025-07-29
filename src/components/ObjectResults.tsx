import React from 'react';
import { CheckCircle, Camera, RotateCcw, Zap, ExternalLink } from 'lucide-react';
import { DetectionResult } from '../App';

interface ObjectResultsProps {
  result: DetectionResult;
  capturedImage: string | null;
  onTakeAnother: () => void;
  onStartOver: () => void;
}

const ObjectResults: React.FC<ObjectResultsProps> = ({
  result,
  capturedImage,
  onTakeAnother,
  onStartOver
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-600 bg-emerald-50';
    if (confidence >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'High confidence';
    if (confidence >= 60) return 'Medium confidence';
    return 'Low confidence';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Object Identified!</h2>
        <p className="text-slate-600">Here's what our AI found in your image</p>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="md:flex">
          {/* Image */}
          {capturedImage && (
            <div className="md:w-1/2">
              <img 
                src={capturedImage} 
                alt="Captured object" 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="md:w-1/2 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 capitalize">
                {result.objectName}
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                {result.confidence}% {getConfidenceText(result.confidence)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Description</h4>
                <p className="text-slate-600 leading-relaxed">{result.description}</p>
              </div>
              
              {result.additionalInfo && result.additionalInfo.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Additional Information</h4>
                  <ul className="space-y-2">
                    {result.additionalInfo.map((info, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600 text-sm">{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* External Links */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.wikipedia.org/wiki/${encodeURIComponent(result.objectName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Learn more on Wikipedia</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h4 className="font-semibold text-slate-800 mb-4">AI Confidence Level</h4>
        <div className="relative">
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                result.confidence >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                result.confidence >= 60 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${result.confidence}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          {result.confidence >= 80 && "Excellent match! Our AI is very confident about this identification."}
          {result.confidence >= 60 && result.confidence < 80 && "Good match! The AI has moderate confidence in this identification."}
          {result.confidence < 60 && "Uncertain match. Consider taking another photo with better lighting or angle."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onTakeAnother}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Camera className="w-5 h-5" />
          <span>Detect Another Object</span>
        </button>
        
        <button
          onClick={onStartOver}
          className="inline-flex items-center justify-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );
};

export default ObjectResults;