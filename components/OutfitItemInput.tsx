import React, { useRef, useCallback, useState, useEffect } from 'react';
import { ClothingItem, InputType } from '../types';
import { TextIcon, ImageIcon, LinkIcon, UploadIcon } from './icons';

interface OutfitItemInputProps {
  label: string;
  item: ClothingItem;
  onItemChange: (item: ClothingItem) => void;
  placeholder: string;
}

const inputTypes: { id: InputType; icon: React.FC<{className?: string}> }[] = [
  { id: 'text', icon: TextIcon },
  { id: 'image', icon: ImageIcon },
  { id: 'url', icon: LinkIcon },
];

const MiniImageUploader: React.FC<{ onSelect: (file: File, base64: string, previewUrl: string) => void }> = ({ onSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') || file.size > 4 * 1024 * 1024) {
            console.error("Invalid file type or size");
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            const previewUrl = URL.createObjectURL(file);
            onSelect(file, base64String, previewUrl);
        };
        reader.readAsDataURL(file);
    }, [onSelect]);

    return (
        <div>
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative block w-full h-28 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-colors duration-300 bg-gray-50/80"
            >
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <UploadIcon />
                    <span className="mt-2 text-xs">Click to upload an image</span>
                </div>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
            />
        </div>
    );
};


const OutfitItemInput: React.FC<OutfitItemInputProps> = ({ label, item, onItemChange, placeholder }) => {
    const [isUrlPreviewValid, setIsUrlPreviewValid] = useState(true);

    useEffect(() => {
      if (item.type === 'url' && item.value) {
        setIsUrlPreviewValid(true);
      }
    }, [item.type, item.value]);
    
    const handleTypeChange = (type: InputType) => {
        onItemChange({ ...item, type, previewUrl: undefined, base64: undefined, mimeType: undefined });
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onItemChange({ ...item, value: e.target.value, previewUrl: undefined, base64: undefined, mimeType: undefined });
    };

    const handleImageSelect = (file: File, base64: string, previewUrl: string) => {
        onItemChange({
            type: 'image',
            value: file.name,
            base64: base64,
            mimeType: file.type,
            previewUrl: previewUrl,
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="flex items-center space-x-1 bg-gray-200/70 border border-gray-200 p-0.5 rounded-lg">
                    {inputTypes.map((typeInfo) => (
                        <button
                            key={typeInfo.id}
                            onClick={() => handleTypeChange(typeInfo.id)}
                            className={`px-2 py-1 rounded-md transition-colors duration-200 ${item.type === typeInfo.id ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-300/50'}`}
                            aria-label={`Switch to ${typeInfo.id} input`}
                        >
                           <typeInfo.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>
            
            {item.type === 'text' && (
                <input
                    type="text"
                    value={item.value}
                    onChange={handleValueChange}
                    placeholder={placeholder}
                    className="w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                />
            )}
            {item.type === 'url' && (
                 <div>
                    <input
                        type="url"
                        value={item.value}
                        onChange={handleValueChange}
                        placeholder="e.g., https://example.com/image.jpg"
                        className="w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                    />
                     {item.value && isUrlPreviewValid && (
                        <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                            <img 
                                src={item.value} 
                                alt="URL preview" 
                                className="w-full h-24 object-contain rounded-md"
                                onError={() => setIsUrlPreviewValid(false)} 
                            />
                        </div>
                    )}
                 </div>
            )}
            {item.type === 'image' && (
                <div>
                    {item.previewUrl ? (
                         <div className="relative group">
                            <img src={item.previewUrl} alt="Outfit preview" className="w-full h-28 object-contain rounded-lg bg-gray-50/80 p-2 border border-gray-200" />
                            <div 
                                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                                onClick={() => onItemChange({ type: 'image', value: '' })}
                            >
                                 <p className="text-white text-sm font-semibold">Change Image</p>
                            </div>
                        </div>
                    ) : (
                       <MiniImageUploader onSelect={handleImageSelect} />
                    )}
                </div>
            )}
        </div>
    );
};

export default OutfitItemInput;