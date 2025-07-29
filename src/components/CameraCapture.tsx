import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Zap, ArrowLeft } from 'lucide-react';

interface CameraCaptureProps {
  onImageCaptured: (imageDataUrl: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
  capturedImage: string | null;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onImageCaptured,
  onAnalyze,
  onBack,
  capturedImage
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      setIsLoading(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission was denied. Please allow camera access and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError('Unable to access camera. Please check your permissions and try again.');
        }
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Compress image for better performance
    const maxWidth = 800;
    const maxHeight = 600;
    
    if (canvas.width > maxWidth || canvas.height > maxHeight) {
      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const newWidth = canvas.width * ratio;
      const newHeight = canvas.height * ratio;
      
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');
      
      if (tempContext) {
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempContext.drawImage(canvas, 0, 0, newWidth, newHeight);
        
        const imageDataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
        onImageCaptured(imageDataUrl);
      }
    } else {
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onImageCaptured(imageDataUrl);
    }
  }, [onImageCaptured]);

  const handleRetakePhoto = useCallback(() => {
    onImageCaptured('');
  }, [onImageCaptured]);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 mb-4">Camera Access Required</h3>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">{error}</p>
        <div className="space-x-4">
          <button
            onClick={startCamera}
            className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-semibold text-slate-800">
          {capturedImage ? 'Review Photo' : 'Capture Object'}
        </h2>
        <div className="w-16"></div>
      </div>

      {/* Camera/Image Display */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured object" 
            className="w-full h-auto max-h-96 object-contain"
          />
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Starting camera...</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-h-96 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
        
        {/* Camera overlay guide */}
        {!capturedImage && hasPermission && !isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 border-2 border-white/30 rounded-xl">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg"></div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              Center object in frame
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {capturedImage ? (
          <>
            <button
              onClick={handleRetakePhoto}
              className="inline-flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>
            <button
              onClick={onAnalyze}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              <span>Analyze Object</span>
            </button>
          </>
        ) : (
          hasPermission && !isLoading && (
            <button
              onClick={captureImage}
              className="inline-flex items-center justify-center w-16 h-16 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
            >
              <Camera className="w-7 h-7 text-slate-700" />
            </button>
          )
        )}
      </div>

      {/* Instructions */}
      {!capturedImage && hasPermission && !isLoading && (
        <p className="text-center text-slate-600 mt-6 text-sm">
          Position the object clearly in the frame and tap the camera button to capture
        </p>
      )}
    </div>
  );
};

export default CameraCapture;