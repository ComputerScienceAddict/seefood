"use client"

import { useRef, useState, useEffect } from "react";
import { X, RotateCw, Camera } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, isFrontCamera]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const constraints = {
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: 16/9
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !streamRef.current) return;

    setIsCapturing(true);
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      
      setTimeout(() => {
        onCapture(imageData);
        onClose();
        setIsCapturing(false);
      }, 300);
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(prev => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-[95vw] h-[80vh] max-w-6xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Camera View Container */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute w-full h-full object-contain"
          />
          
          {/* Capture flash effect */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white animate-flash z-30" />
          )}
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-300 z-10 hover:scale-110"
          >
            <X size={28} />
          </button>

          {/* Camera switch button */}
          <button
            onClick={toggleCamera}
            className="absolute top-6 left-6 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-300 z-10 hover:scale-110"
            title="Switch Camera"
          >
            <RotateCw size={28} />
          </button>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent"></div>
            </div>
          )}

          {/* Camera frame overlay */}
          <div className="absolute inset-6 border-2 border-white/20 rounded-2xl pointer-events-none" />
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex justify-center items-center gap-8 z-10">
          <button
            onClick={captureImage}
            className="w-20 h-20 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center group"
            title="Take Photo"
          >
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-8 py-4 rounded-xl shadow-lg animate-fade-in z-20 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Camera status */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm z-10">
          {isFrontCamera ? "Front Camera" : "Back Camera"}
        </div>
      </div>
    </div>
  );
} 