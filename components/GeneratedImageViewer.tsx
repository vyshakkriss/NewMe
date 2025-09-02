import React from 'react';
import { GeneratedImage } from '../types';
import { GenerateIcon, PlaceholderIcon, ViewIcon } from './icons';

interface GeneratedImageViewerProps {
  isLoading: boolean;
  error: string | null;
  images: GeneratedImage[];
  onImageClick: (index: number) => void;
}

const LOADING_MESSAGES = [
    "Warming up the AI stylist...", "Sketching your new look...", "Analyzing your style...", "Generating different poses and angles...", "Polishing the final images...", "Almost ready for your big reveal!"
];

const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ isLoading, error, images, onImageClick }) => {
    const [loadingMessage, setLoadingMessage] = React.useState(LOADING_MESSAGES[0]);

    React.useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const nextIndex = (LOADING_MESSAGES.indexOf(prev) + 1) % LOADING_MESSAGES.length;
                    return LOADING_MESSAGES[nextIndex];
                });
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-10"></div>
          <div className="absolute inset-0 rounded-full animate-spin" style={{ background: 'conic-gradient(from 90deg at 50% 50%, rgba(255,255,255,0) 0%, #ec4899 100%)' }}></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GenerateIcon className="w-8 h-8 text-pink-500" />
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-900 mt-6">Generating Your Virtual Try-On</p>
        <p className="mt-2 text-sm transition-opacity duration-500">{loadingMessage}</p>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-700 p-4 bg-red-50 rounded-xl">
        <h3 className="text-lg font-semibold text-red-800">An Error Occurred</h3>
        <p className="mt-2 text-sm max-w-sm">{error}</p>
      </div>
    );
  }

  if (images.length > 0) {
    return (
      <div className="h-full overflow-y-auto pr-2 -mr-2">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 mb-4 flex items-center">
          <GenerateIcon /> <span className="ml-2">Your New Look</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => onImageClick(index)}
              className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden opacity-0 animate-fade-in-up group relative shadow-md cursor-pointer"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img src={img.src} alt={`Generated outfit ${index + 1}`} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <div className="py-2 px-4 bg-white/90 text-gray-800 font-semibold rounded-full text-sm backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center">
                  <ViewIcon />
                  View
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl p-8">
      <PlaceholderIcon />
      <h3 className="mt-4 text-lg font-semibold text-gray-700">Your Generated Images Will Appear Here</h3>
      <p className="mt-1 text-sm max-w-xs">Fill out the form and click "Generate My Look" to see the magic happen!</p>
    </div>
  );
};

export default GeneratedImageViewer;
