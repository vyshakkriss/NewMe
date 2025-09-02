import React, { useRef } from 'react';
import { OutfitItemState, InspirationItem, CustomImage } from '../types';
import { UploadIcon } from './icons';

interface OutfitItemInputProps {
  label: string;
  item: OutfitItemState;
  onItemChange: (item: OutfitItemState) => void;
  inspirationItems: InspirationItem[];
}

const fileToCustomImage = (file: File): Promise<CustomImage> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const previewUrl = URL.createObjectURL(file);
        const base64 = (reader.result as string).split(',')[1];
        resolve({ file, base64, mimeType: file.type, previewUrl });
    };
    reader.onerror = error => reject(error);
});

const OutfitItemInput: React.FC<OutfitItemInputProps> = ({ label, item, onItemChange, inspirationItems }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInspirationSelect = (url: string) => {
        if (item.customImage?.previewUrl) URL.revokeObjectURL(item.customImage.previewUrl);
        onItemChange({ ...item, inspirationUrl: item.inspirationUrl === url ? null : url, customImage: null });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                if (item.customImage?.previewUrl) URL.revokeObjectURL(item.customImage.previewUrl);
                const customImage = await fileToCustomImage(file);
                onItemChange({ ...item, customImage, inspirationUrl: null });
            } catch (error) {
                console.error("Error processing file:", error);
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveCustomImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.customImage?.previewUrl) URL.revokeObjectURL(item.customImage.previewUrl);
        onItemChange({ ...item, customImage: null });
    };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {inspirationItems.map(insp => (
          <button
            key={insp.id}
            type="button"
            onClick={() => handleInspirationSelect(insp.imageUrl)}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ${item.inspirationUrl === insp.imageUrl ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-gray-300 hover:ring-pink-400'}`}
          >
            <img src={insp.imageUrl} alt={insp.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
              <span className="text-white text-[11px] font-semibold text-center leading-tight">{insp.label}</span>
            </div>
            {item.inspirationUrl === insp.imageUrl && <div className="absolute inset-0 border-2 border-pink-500 rounded-xl"></div>}
          </button>
        ))}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <button
            type="button"
            onClick={handleUploadClick}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ring-1 ${item.customImage ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-dashed ring-gray-300 hover:ring-pink-400'}`}
        >
            {item.customImage ? (
                <>
                    <img src={item.customImage.previewUrl} alt="Custom upload" className="w-full h-full object-cover" />
                    <div onClick={handleRemoveCustomImage} className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 hover:text-pink-600 transition-colors">
                    <UploadIcon className="w-8 h-8 text-gray-400" />
                    <span className="mt-1 text-xs font-semibold text-center">Upload Your Own</span>
                </div>
            )}
        </button>
      </div>
      <input
        type="text"
        value={item.text}
        onChange={e => onItemChange({ ...item, text: e.target.value })}
        placeholder={`Optional: e.g., "dark wash denim" or "silk"`}
        className="mt-1 w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
      />
    </div>
  );
};

export default OutfitItemInput;
