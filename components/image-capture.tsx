"use client"

import { useState } from "react";
import { Camera } from "lucide-react";
import CameraModal from "./camera-modal";

interface ImageCaptureProps {
  onImageCapture: (base64Image: string) => void;
  onClose?: () => void;
}

export default function ImageCapture({ onImageCapture, onClose }: ImageCaptureProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.99]"
      >
        <Camera size={24} />
        <span className="text-lg font-medium">Open Camera</span>
      </button>

      <CameraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCapture={onImageCapture}
      />
    </>
  );
}