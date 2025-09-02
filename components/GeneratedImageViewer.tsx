import React, { useState, useEffect } from 'react';
import { AwaitingIcon, SparklesIcon, DownloadIcon, StarIcon, TagIcon, CopyIcon } from './icons';
import { StyleRating, ShoppingPrompt } from '../types';
import ImagePreviewModal from './ImagePreviewModal';

interface GeneratedImageViewerProps {
  images: string[];
  isLoading: boolean;
  error: string | null;
  styleRating: StyleRating | null;
  shoppingPrompts: ShoppingPrompt[] | null;
}

const loadingMessages = [
  "Warming up the AI stylist...",
  "Sketching your new look...",
  "Analyzing your style...",
  "Generating different poses and angles...",
  "Rating your new style...",
  "Polishing the final images...",
  "Almost ready for your big reveal!"
];

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (loadingMessages.length > 1) {
        const interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
       <div className="relative w-24 h-24">
         <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-10"></div>
         <div className="absolute inset-0 rounded-full animate-spin" style={{ background: `conic-gradient(from 90deg at 50% 50%, rgba(255,255,255,0) 0%, #ec4899 100%)`}}></div>
         <div className="absolute inset-2 bg-white rounded-full"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 text-pink-500" />
         </div>
       </div>
      <p className="text-lg font-semibold text-gray-900 mt-6">Generating Your Virtual Try-On</p>
      <p className="mt-2 text-sm transition-opacity duration-500">{loadingMessages[messageIndex]}</p>
    </div>
  );
};

const StyleMeter: React.FC<{ rating: StyleRating }> = ({ rating }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [revealedStars, setRevealedStars] = useState(0);

    useEffect(() => {
        setIsAnalyzing(true);
        setRevealedStars(0);

        const analysisTimer = setTimeout(() => {
            setIsAnalyzing(false);
            // Animate stars reveal
            for (let i = 1; i <= rating.rating; i++) {
                setTimeout(() => setRevealedStars(i), i * 150);
            }
        }, 3500);

        return () => {
            clearTimeout(analysisTimer);
        };
    }, [rating]);

    return (
        <div className="mt-6 p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                <StarIcon className="w-5 h-5 mr-2 text-yellow-400" filled />
                Style Meter
            </h3>
            {isAnalyzing ? (
                <div className="space-y-2">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className="w-6 h-6 text-gray-300" filled={false} />
                        ))}
                    </div>
                    <div className="relative w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 animate-analyze-progress"></div>
                    </div>
                    <p className="text-sm text-center font-medium text-gray-600">Analyzing your look...</p>
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-6 h-6 transition-colors duration-300 ${i < revealedStars ? 'text-yellow-400' : 'text-gray-300'}`} filled={i < revealedStars} />
                        ))}
                    </div>
                     <p className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">"{rating.title}"</p>
                    <p className="text-sm text-gray-600 mt-1">{rating.critique}</p>
                </div>
            )}
        </div>
    );
};

const ShoppingPromptsDisplay: React.FC<{ prompts: ShoppingPrompt[] }> = ({ prompts }) => {
    const [copied, setCopied] = useState<Record<number, boolean>>({});

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopied({ ...copied, [index]: true });
        setTimeout(() => {
            setCopied(prev => ({ ...prev, [index]: false }));
        }, 2000);
    };

    return (
        <div className="mt-6 p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                <TagIcon className="w-5 h-5 mr-2 text-purple-500" />
                Find This Look
            </h3>
            <div className="space-y-2">
                {prompts.map((p, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                        <div className="flex-1 mr-2">
                           <p className="text-xs font-semibold text-gray-500">{p.itemName}</p>
                           <p className="text-sm text-gray-800 font-medium">{p.prompt}</p>
                        </div>
                        <button 
                          onClick={() => handleCopy(p.prompt, index)}
                          className="p-2 text-gray-500 hover:text-pink-600 bg-gray-100 hover:bg-pink-100 rounded-md transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          aria-label="Copy prompt"
                        >
                            <CopyIcon copied={copied[index]} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ images, isLoading, error, styleRating, shoppingPrompts }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    const mimeType = imageUrl.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1] || 'png';
    const index = images.findIndex(img => img === imageUrl);
    link.download = `newme-try-on-${index + 1}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-700 p-4 bg-red-50 rounded-xl">
        <h3 className="text-lg font-semibold text-red-800">An Error Occurred</h3>
        <p className="mt-2 text-sm max-w-sm">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl p-8">
        <AwaitingIcon />
        <h3 className="mt-4 text-lg font-semibold text-gray-700">Your Generated Images Will Appear Here</h3>
        <p className="mt-1 text-sm max-w-xs">Fill out the form and click "Generate My Look" to see the magic happen!</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 -mr-2">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 mb-4 flex items-center">
            <SparklesIcon/> <span className="ml-2">Your New Look</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((src, index) => (
            <div 
                key={index} 
                onClick={() => setSelectedImage(src)}
                className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden opacity-0 animate-fade-in-up group relative shadow-md cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
            >
                <img
                    src={src}
                    alt={`Generated outfit ${index + 1}`}
                    className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-sm font-bold scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">View</p>
                </div>
            </div>
            ))}
      </div>
      
      {styleRating && <StyleMeter rating={styleRating} />}
      {shoppingPrompts && shoppingPrompts.length > 0 && <ShoppingPromptsDisplay prompts={shoppingPrompts} />}
      
      {selectedImage && (
        <ImagePreviewModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={() => handleDownload(selectedImage)}
        />
      )}

      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes analyze-progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0%); }
        }
        .animate-analyze-progress {
            animation: analyze-progress 3.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GeneratedImageViewer;