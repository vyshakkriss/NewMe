import React, { useRef } from 'react';
import { PlusIcon, TrashIcon, ImageIcon } from './icons';
import { ClothingItem } from '../types';

interface AccessoryInputProps {
  accessories: ClothingItem[];
  setAccessories: (accessories: ClothingItem[]) => void;
}

const MAX_ACCESSORIES = 10;

const AccessoryInput: React.FC<AccessoryInputProps> = ({ accessories, setAccessories }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentAccessoryIndex = useRef<number | null>(null);

  const handleAccessoryChange = (index: number, value: string) => {
    const newAccessories = [...accessories];
    newAccessories[index] = { ...newAccessories[index], value, type: value.startsWith('http') ? 'url' : 'text' };
    setAccessories(newAccessories);
  };

  const addAccessory = () => {
    if (accessories.length < MAX_ACCESSORIES) {
      setAccessories([...accessories, { type: 'text', value: '' }]);
    }
  };

  const removeAccessory = (index: number) => {
    if (accessories.length > 1) {
      const newAccessories = accessories.filter((_, i) => i !== index);
      setAccessories(newAccessories);
    } else {
      setAccessories([{ type: 'text', value: '' }]);
    }
  };

  const handleImageUploadClick = (index: number) => {
    currentAccessoryIndex.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const index = currentAccessoryIndex.current;
    if (!file || index === null) return;
    
    if (!file.type.startsWith('image/') || file.size > 4 * 1024 * 1024) {
      // Basic validation, consider showing an error message to the user
      console.error("Invalid file type or size");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      const previewUrl = URL.createObjectURL(file);
      const newAccessories = [...accessories];
      newAccessories[index] = {
        type: 'image',
        value: file.name,
        base64: base64String,
        mimeType: file.type,
        previewUrl: previewUrl,
      };
      setAccessories(newAccessories);
    };
    reader.readAsDataURL(file);
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };


  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Accessories (Optional, Max {MAX_ACCESSORIES})</label>
      <div className="space-y-2">
        {accessories.map((acc, index) => (
          <div key={index} className="flex items-center space-x-2 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
            {acc.type === 'image' && acc.previewUrl ? (
                 <div className="flex-grow flex items-center space-x-2 bg-gray-50/80 border border-gray-300 rounded-lg pl-3">
                    <img src={acc.previewUrl} alt="Accessory preview" className="w-8 h-8 object-cover rounded-md" />
                    <span className="text-sm text-gray-700 truncate flex-grow">{acc.value}</span>
                 </div>
            ) : (
                <input
                  type="text"
                  value={acc.value}
                  onChange={(e) => handleAccessoryChange(index, e.target.value)}
                  placeholder={`Accessory ${index + 1} (description or URL)`}
                  className="w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                />
            )}
            <button
              onClick={() => handleImageUploadClick(index)}
              className="p-2 text-gray-500 hover:text-pink-500 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-110"
              aria-label="Upload accessory image"
            >
              <ImageIcon />
            </button>
            <button
              onClick={() => removeAccessory(index)}
              className="p-2 text-gray-500 hover:text-red-500 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-all duration-200 transform hover:scale-110"
              aria-label="Remove accessory"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
        {accessories.length < MAX_ACCESSORIES && (
          <button
            onClick={addAccessory}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-800 hover:border-pink-500 transition-colors duration-200"
          >
            <PlusIcon />
            <span>Add Accessory</span>
          </button>
        )}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="sr-only"
            accept="image/*"
        />
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AccessoryInput;