import React, { useEffect, useState, useCallback } from 'react';
import { GeneratedImage, ShoppingPrompt } from '../types';
import { getShoppingPromptsForImage } from '../services/geminiService';
import { CopyIcon, CheckIcon, CloseIcon, FindLookIcon, ShareIcon, DownloadIcon, LoadingSpinnerIcon } from './icons';

interface ImagePreviewModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onUpdateImage: (updates: Partial<GeneratedImage>) => void;
}

const ShoppingPrompts: React.FC<{ prompts: ShoppingPrompt[] | null, isLoading: boolean }> = ({ prompts, isLoading }) => {
    const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

    const handleCopy = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        setCopiedPrompt(prompt);
        setTimeout(() => setCopiedPrompt(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <LoadingSpinnerIcon />
                <span>Generating keywords...</span>
            </div>
        );
    }

    if (!prompts || prompts.length === 0) {
        return <p className="text-sm text-gray-500">Shopping keywords could not be generated for this image.</p>;
    }
    
    return (
        <div className="space-y-3">
            {prompts.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50/80 p-2 rounded-lg border border-gray-200/80">
                    <div className="flex-1 mr-2">
                        <p className="text-xs font-semibold text-gray-500">{p.itemName}</p>
                        <p className="text-sm text-gray-800 font-medium">{p.prompt}</p>
                    </div>
                    <button onClick={() => handleCopy(p.prompt)} className="p-2 text-gray-500 hover:text-pink-600 bg-gray-100 hover:bg-pink-100 rounded-md transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500" aria-label="Copy prompt">
                        {copiedPrompt === p.prompt ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>
            ))}
        </div>
    );
};

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ image, onClose, onUpdateImage }) => {
    useEffect(() => {
        const fetchPrompts = async () => {
            if (image.shoppingPrompts === null && image.isLoadingPrompts) {
                try {
                    const prompts = await getShoppingPromptsForImage(image.base64, image.mimeType);
                    onUpdateImage({ shoppingPrompts: prompts, isLoadingPrompts: false });
                } catch (e) {
                    console.error("Failed to get shopping prompts", e);
                    onUpdateImage({ shoppingPrompts: [], isLoadingPrompts: false });
                }
            }
        };
        fetchPrompts();
    }, [image, onUpdateImage]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `newme-try-on-${Date.now()}.png`;
        link.click();
    };

    const handleShare = async () => {
        if (!navigator.share) {
            alert("Web Share API is not supported in your browser.");
            return;
        }
        try {
            const response = await fetch(image.src);
            const blob = await response.blob();
            const file = new File([blob], `newme-try-on-${Date.now()}.png`, { type: blob.type });

            const shareData = {
                files: [file],
                title: 'My New Look from NewMe!',
                text: 'Check out this virtual try-on outfit I created with AI.',
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.share({ title: shareData.title, text: shareData.text });
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
                alert('An error occurred while sharing the image.');
            }
        }
    };
    
    const handleEsc = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [handleEsc]);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm modal-animate-fade-in p-4">
      <div onClick={e => e.stopPropagation()} className="relative bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden modal-animate-scale-in">
        <div className="md:w-2/3 h-1/2 md:h-full bg-gray-100 flex items-center justify-center">
          <img src={image.src} alt="Generated outfit preview" className="w-full h-full object-contain" />
        </div>
        <div className="md:w-1/3 h-1/2 md:h-full flex flex-col">
          <div className="p-6 flex-grow overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
              <FindLookIcon /> Find This Look
            </h3>
            <ShoppingPrompts prompts={image.shoppingPrompts} isLoading={image.isLoadingPrompts} />
          </div>
          <div className="p-6 border-t border-gray-200/80">
            <div className="flex items-center space-x-3">
              {navigator.share && (
                <button onClick={handleShare} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none" aria-label="Share image">
                  <ShareIcon /> Share
                </button>
              )}
              <button onClick={handleDownload} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none" aria-label="Download image">
                <DownloadIcon /> Download
              </button>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close preview">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
