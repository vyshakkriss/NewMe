import React, { useRef, useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File, base64: string, previewUrl: string) => void;
  imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, etc.).');
        return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image size should be less than 4MB.');
        return;
    }
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      const previewUrl = URL.createObjectURL(file);
      onImageSelect(file, base64String, previewUrl);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Manually trigger the change event handler
      const mockEvent = { target: { files: event.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(mockEvent);
    }
  }, [handleFileChange]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };


  return (
    <div>
      <label
        htmlFor="file-upload"
        className="relative block w-full h-64 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-pink-500 transition-colors duration-300 bg-gray-50/80"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-xl" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UploadIcon />
            <span className="mt-2 text-sm">Drag & drop an image, or click to select</span>
            <span className="text-xs">PNG, JPG, WEBP up to 4MB</span>
          </div>
        )}
      </label>
      <input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;