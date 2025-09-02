import React, { useEffect } from 'react';
import { CloseIcon, DownloadIcon } from './icons';

interface ImagePreviewModalProps {
  src: string;
  onClose: () => void;
  onDownload: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, onClose, onDownload }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] w-full p-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="Generated outfit preview" className="w-full h-full object-contain rounded-lg shadow-2xl" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close preview"
        >
          <CloseIcon />
        </button>

        <button
          onClick={onDownload}
          className="absolute bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-full flex items-center justify-center space-x-2 font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 focus-visible:ring-white"
          aria-label="Download image"
        >
          <DownloadIcon />
          <span>Download</span>
        </button>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ImagePreviewModal;
