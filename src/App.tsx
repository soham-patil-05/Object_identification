import React, { useState, useRef, useCallback } from 'react';
import { Camera, Zap, AlertCircle, CheckCircle, RefreshCw, Eye,X } from 'lucide-react';
import CameraCapture from './components/CameraCapture';
import ObjectResults from './components/ObjectResults';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { detectObject } from './services/geminiService';
import my_image from './images/soham.png';

export interface DetectionResult {
  objectName: string;
  confidence: number;
  description: string;
  additionalInfo?: string[];
}

type AppState = 'landing' | 'camera' | 'analyzing' | 'results' | 'error';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartDetection = useCallback(() => {
    setCurrentState('camera');
    setError(null);
  }, []);

  const handleImageCaptured = useCallback((imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
  }, []);

  const handleAnalyzeImage = useCallback(async () => {
    if (!capturedImage) return;

    setCurrentState('analyzing');
    
    try {
      const result = await detectObject(capturedImage);
      setDetectionResult(result);
      setCurrentState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setCurrentState('error');
    }
  }, [capturedImage]);

  const handleRetry = useCallback(() => {
    setCapturedImage(null);
    setDetectionResult(null);
    setError(null);
    setCurrentState('landing');
  }, []);

  const handleTakeAnother = useCallback(() => {
    setCapturedImage(null);
    setDetectionResult(null);
    setCurrentState('camera');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Snap & Learn
            </h1>
          </div>
          <div className="text-sm text-slate-600 hidden sm:block">
            AI-Powered Object Detection
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {currentState === 'landing' && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-8 shadow-lg">
                <Camera className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
                Snap & Learn with
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Vision
                </span>
              </h2>
              
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Point your camera at any object and discover what it is instantly. 
                No signup required—just snap, analyze, and learn!
              </p>
              
              <button 
                onClick={handleStartDetection}
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Camera className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-lg">Detect Object</span>
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Instant Capture</h3>
                  <p className="text-slate-600 text-sm">Use your device camera to snap photos of any object</p>
                </div>
                
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">AI Analysis</h3>
                  <p className="text-slate-600 text-sm">Advanced AI identifies objects with high accuracy</p>
                </div>
                
                <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Rich Info</h3>
                  <p className="text-slate-600 text-sm">Get detailed descriptions and interesting facts</p>
                </div>
              </div>
            </div>
          )}

          {currentState === 'camera' && (
            <CameraCapture 
              onImageCaptured={handleImageCaptured}
              onAnalyze={handleAnalyzeImage}
              onBack={handleRetry}
              capturedImage={capturedImage}
            />
          )}

          {currentState === 'analyzing' && (
            <div className="text-center py-20">
              <LoadingSpinner />
              <h3 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
                Analyzing Your Image
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Our AI is examining the object and gathering detailed information...
              </p>
            </div>
          )}

          {currentState === 'results' && detectionResult && (
            <ObjectResults 
              result={detectionResult}
              capturedImage={capturedImage}
              onTakeAnother={handleTakeAnother}
              onStartOver={handleRetry}
            />
          )}

          {currentState === 'error' && (
            <ErrorDisplay 
              error={error || 'An unexpected error occurred'}
              onRetry={handleRetry}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      {/* Footer */}
<footer className="relative z-10 mt-16 py-8 border-t border-white/20 bg-white/30 backdrop-blur-sm">
  {/* Made by section */}
  <div className="max-w-4xl mx-auto px-4 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
    {/* Person image */}
    <div className="flex-shrink-0">
      <img
        src={my_image}
        alt="Soham Patil"
        className="w-24 h-24 rounded-full object-cover border-2 border-white/50"
      />
    </div>
    {/* Description + Social Links */}
    <div className="text-center sm:text-left">
      <p className="text-slate-700 text-base leading-relaxed mb-4">
        Hi, I’m <strong>Soham Patil</strong>, currently pursuing my BE in Information Technology at Pune Institute of Technology. I built this object detection website just for fun and to explore some cool tech. It uses the Gemini API for AI and Supabase to handle secure requests.  
        Hope you found it interesting and had a little fun trying it out 🙃.
      </p>
      <div className="flex justify-center sm:justify-start space-x-4">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/soham05___/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-slate-600 hover:text-slate-800"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            {/* Instagram icon SVG path */}
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.88a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25z" />
          </svg>
        </a>
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/soham-patil-27a9b2287/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-slate-600 hover:text-slate-800"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            {/* LinkedIn icon SVG path */}
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8h4.56V24H.22V8zM8.66 8h4.38v2.2h.06c.61-1.16 2.1-2.38 4.32-2.38C21.88 7.82 24 10.48 24 14.44V24h-4.56v-8.3c0-1.98-.04-4.53-2.76-4.53-2.76 0-3.18 2.15-3.18 4.38V24H8.66V8z"/>
          </svg>
        </a>
        {/* Twitter */}
       <a
          href="https://x.com/Soham_patil_05"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="text-slate-600 hover:text-slate-800"
        >
          <svg
            className="w-6 h-6"
            role="img"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>X</title>
            <path d="M9.5,6.8l5.8-6.2h-1.4l-5,5.4l-4-5.4H0l6.2,8.2L0,15.5h1.4l5.4-5.9l4.4,5.9H16L9.5,6.8z M2.1,1.6h2.2l9.7,12.9h-2.2L2.1,1.6z"/>
          </svg>
        </a>

      </div>
    </div>
  </div>

  {/* Original footer content */}
  <div className="max-w-4xl mx-auto px-4 text-center">
    <p className="text-slate-600 text-sm leading-relaxed">
      <strong>Snap &amp; Learn</strong> is a free tool for quick object identification—no login required.
      <br className="hidden sm:block" />
      <span className="text-slate-500">
        Powered by Google Gemini Vision. Images are processed securely and not stored.
      </span>
    </p>
  </div>
</footer>

    </div>
  );
}

export default App;
