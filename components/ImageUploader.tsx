import React, { useState, useCallback } from 'react';
import { UserImage } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  userImage: UserImage;
  onImageSelect: (image: UserImage) => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const ImageUploader: React.FC<ImageUploaderProps> = ({ userImage, onImageSelect }) => {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, etc.).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
      setError('Image size should be less than 4MB.');
      return;
    }
    setError('');

    try {
        const base64 = await fileToBase64(file);
        if (userImage.previewUrl) {
            URL.revokeObjectURL(userImage.previewUrl);
        }
        onImageSelect({
            file,
            base64,
            mimeType: file.type,
            previewUrl: URL.createObjectURL(file),
        });
    } catch (err) {
        setError('Could not process the image file.');
    }
  }, [onImageSelect, userImage.previewUrl]);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files ? e.target.files[0] : null);
    e.target.value = ''; // Reset input to allow re-selection of the same file
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative block w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-gray-50/80 hover:border-pink-500'}`}
      >
        {userImage.previewUrl ? (
          <div className="w-full h-full">
            <img src={userImage.previewUrl} alt="Preview" className="w-full h-full object-contain rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UploadIcon />
            <span className="mt-2 text-sm">Drag & drop an image, or click to select</span>
            <span className="text-xs">PNG, JPG, WEBP up to 4MB</span>
          </div>
        )}
      </label>
      <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
