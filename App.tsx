import React, { useState, useCallback } from 'react';
import { Outfit, ClothingItem, BackgroundOption, StyleRating, ShoppingPrompt } from './types';
import { generateStyledImages, generateSurpriseOutfit, rateOutfitStyle, generateShoppingPrompts } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import AccessoryInput from './components/AccessoryInput';
import GeneratedImageViewer from './components/GeneratedImageViewer';
import { HeaderIcon, SparklesIcon, MagicWandIcon } from './components/icons';
import OutfitItemInput from './components/OutfitItemInput';

const backgroundOptions: { id: BackgroundOption; label: string; imageUrl: string }[] = [
  { id: 'studio', label: 'Neutral Studio', imageUrl: 'https://images.pexels.com/photos/842950/pexels-photo-842950.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'keep', label: 'Keep Original', imageUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'outdoor_cafe', label: 'Outdoor Cafe', imageUrl: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'city_street', label: 'City Street', imageUrl: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'beach_sunset', label: 'Sunny Beach', imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];


const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [topWear, setTopWear] = useState<ClothingItem>({ type: 'text', value: '' });
  const [bottomWear, setBottomWear] = useState<ClothingItem>({ type: 'text', value: '' });
  const [accessories, setAccessories] = useState<ClothingItem[]>([{ type: 'text', value: '' }]);
  const [background, setBackground] = useState<BackgroundOption>('studio');
  const [customBackgroundPrompt, setCustomBackgroundPrompt] = useState<string>('');
  const [imageCount, setImageCount] = useState<number>(3);

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [styleRating, setStyleRating] = useState<StyleRating | null>(null);
  const [shoppingPrompts, setShoppingPrompts] = useState<ShoppingPrompt[] | null>(null);


  const handleImageSelect = useCallback((file: File, base64: string, previewUrl: string) => {
    setImageFile(file);
    setImageBase64(base64);
    setImagePreviewUrl(previewUrl);
  }, []);

  const isFormValid = imageFile && (topWear.value || topWear.base64) && (bottomWear.value || bottomWear.base64);

  const processGeneration = async (outfit: Outfit, currentImageBase64: string, currentImageFileType: string) => {
      const images = await generateStyledImages(currentImageBase64, currentImageFileType, outfit, background, customBackgroundPrompt, imageCount);
      setGeneratedImages(images);
      
      const [rating, prompts] = await Promise.all([
          rateOutfitStyle(outfit),
          generateShoppingPrompts(outfit)
      ]);
      setStyleRating(rating);
      setShoppingPrompts(prompts);
  };

  const handleGenerate = async () => {
    if (!isFormValid || !imageBase64 || !imageFile) {
      setError('Please upload your photo and provide details for both top and bottom wear.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setStyleRating(null);
    setShoppingPrompts(null);

    const outfit: Outfit = {
      topWear,
      bottomWear,
      accessories: accessories.filter(acc => acc.value.trim() !== '' || acc.type === 'image'),
    };

    try {
      await processGeneration(outfit, imageBase64, imageFile.type);
    } catch (err) {
      console.error(err);
      setError('Failed to generate images. Please try again. The model may not be available in your region or the request was refused.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    if (!imageFile || !imageBase64) {
      setError('Please upload your photo before using "Surprise Me".');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setStyleRating(null);
    setShoppingPrompts(null);

    try {
      const surprise = await generateSurpriseOutfit(imageBase64, imageFile.type);

      const newTop = { type: 'text' as const, value: surprise.topWear.description };
      const newBottom = { type: 'text' as const, value: surprise.bottomWear.description };
      const newAccessories = surprise.accessories.map(acc => ({ type: 'text' as const, value: acc.description }));

      setTopWear(newTop);
      setBottomWear(newBottom);
      setAccessories(newAccessories.length > 0 ? newAccessories : [{ type: 'text', value: '' }]);

      const outfitForApi: Outfit = {
        topWear: newTop,
        bottomWear: newBottom,
        accessories: newAccessories,
      };

      await processGeneration(outfitForApi, imageBase64, imageFile.type);
    } catch (err) {
      console.error(err);
      setError('Failed to generate a surprise outfit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setImageFile(null);
    setImageBase64(null);
    setImagePreviewUrl(null);
    setTopWear({ type: 'text', value: '' });
    setBottomWear({ type: 'text', value: '' });
    setAccessories([{ type: 'text', value: '' }]);
    setBackground('studio');
    setCustomBackgroundPrompt('');
    setImageCount(3);
    setGeneratedImages([]);
    setError(null);
    setIsLoading(false);
    setStyleRating(null);
    setShoppingPrompts(null);
  };

  const SectionTitle: React.FC<{ number: number; title: string; subtitle: string }> = ({ number, title, subtitle }) => (
    <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="flex items-center justify-center w-8 h-8 mr-3 text-lg font-bold text-white rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">{number}</span>
            {title}
        </h2>
        <p className="text-sm text-gray-500 pl-11">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-20 border-b border-gray-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HeaderIcon />
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
              Virtual Try-On AI
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/50 flex flex-col space-y-6 h-fit animate-fade-in-up">
            <SectionTitle number={1} title="Upload Your Photo" subtitle="Upload a clear, full-body photo of yourself." />
            <ImageUploader onImageSelect={handleImageSelect} imagePreviewUrl={imagePreviewUrl} />
            
            <div className="pt-2">
                 <button 
                  onClick={handleSurpriseMe} 
                  disabled={!imageFile || isLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg hover:shadow-gray-200/50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-pink-500 shadow-md shadow-gray-200/40 disabled:shadow-none"
              >
                  <MagicWandIcon className="mr-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
                  Surprise Me
              </button>
              <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

            <SectionTitle number={2} title="Describe Your Outfit" subtitle="Describe your desired outfit using text, a URL, or by uploading an image." />

            <div className="space-y-4">
              <OutfitItemInput
                label="Top Wear"
                item={topWear}
                onItemChange={setTopWear}
                placeholder="e.g., a black leather jacket over a white t-shirt"
              />
              <OutfitItemInput
                label="Bottom Wear"
                item={bottomWear}
                onItemChange={setBottomWear}
                placeholder="e.g., dark blue slim-fit jeans"
              />
            </div>
            
            <AccessoryInput accessories={accessories} setAccessories={setAccessories} />
            
             <SectionTitle number={3} title="Choose Your Background" subtitle="Select a background, or describe your own." />
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {backgroundOptions.map(option => (
                        <button key={option.id} onClick={() => setBackground(option.id)} className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ${
                            background === option.id ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-gray-300 hover:ring-pink-400'
                        }`}>
                            <img src={option.imageUrl} alt={option.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
                                <span className="text-white text-xs font-semibold text-center">{option.label}</span>
                            </div>
                            {background === option.id && <div className="absolute inset-0 border-2 border-pink-500 rounded-xl"/>}
                        </button>
                    ))}
                </div>
                 <input
                    type="text"
                    value={customBackgroundPrompt}
                    onChange={(e) => setCustomBackgroundPrompt(e.target.value)}
                    placeholder="Optional: Further describe the background..."
                    className="mt-1 w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                />

              <SectionTitle number={4} title="Number of Images" subtitle="Choose how many variations to generate." />
              <div className="w-full bg-gray-100 p-1.5 rounded-full flex items-center justify-between">
                  {[1, 2, 3, 4, 5].map(num => (
                      <button
                          key={num}
                          onClick={() => setImageCount(num)}
                          className={`flex-1 py-2 text-center rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none ${
                              imageCount === num 
                              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-md' 
                              : 'text-gray-600 hover:bg-white/80'
                          }`}
                      >
                          {num}
                      </button>
                  ))}
              </div>


            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGenerate}
                  disabled={!isFormValid || isLoading}
                  className="flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:shadow-xl hover:shadow-pink-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-pink-500 shadow-lg shadow-pink-500/20 disabled:shadow-none"
                >
                  <SparklesIcon />
                  {isLoading ? 'Generating...' : 'Generate My Look'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                  Reset
                </button>
              </div>
            </div>

          </div>

          {/* Output Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/50 min-h-[500px] lg:min-h-0 sticky top-28 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <GeneratedImageViewer 
                images={generatedImages} 
                isLoading={isLoading} 
                error={error} 
                styleRating={styleRating}
                shoppingPrompts={shoppingPrompts}
            />
          </div>
        </div>
      </main>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;