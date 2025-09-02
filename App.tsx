import React, { useState, useCallback } from 'react';
import {
  HeaderIcon,
  SurpriseMeIcon,
  GenerateIcon,
  AmazonIcon,
  FlipkartIcon,
  MeeshoIcon,
  MyntraIcon,
} from './components/icons';
import ImageUploader from './components/ImageUploader';
import OutfitItemInput from './components/OutfitItemInput';
import GeneratedImageViewer from './components/GeneratedImageViewer';
import ImagePreviewModal from './components/ImagePreviewModal';
import { generateOutfitImages, getSurpriseOutfit } from './services/geminiService';
import { AppState, GeneratedImage, OutfitItemState } from './types';
import {
  MAX_ACCESSORIES,
  OCCASION_OPTIONS,
  BACKGROUND_OPTIONS,
  TOP_WEAR_INSPIRATION,
  BOTTOM_WEAR_INSPIRATION,
  ACCESSORIES_INSPIRATION,
} from './constants';

const initialState: AppState = {
  userImage: { file: null, base64: null, mimeType: null, previewUrl: null },
  topWear: { id: 'topWear', text: '', customImage: null, inspirationUrl: null },
  bottomWear: { id: 'bottomWear', text: '', customImage: null, inspirationUrl: null },
  accessories: { id: 'accessories', text: '', customImage: null, inspirationUrl: null },
  occasion: 'party',
  customOccasionPrompt: '',
  background: 'studio',
  customBackgroundPrompt: '',
  imageCount: 3,
  generatedImages: [],
  isLoading: false,
  error: null,
};

const App = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const handleReset = useCallback(() => {
    // Revoke old object URLs to prevent memory leaks
    if (state.userImage.previewUrl) URL.revokeObjectURL(state.userImage.previewUrl);
    if (state.topWear.customImage?.previewUrl) URL.revokeObjectURL(state.topWear.customImage.previewUrl);
    if (state.bottomWear.customImage?.previewUrl) URL.revokeObjectURL(state.bottomWear.customImage.previewUrl);
    if (state.accessories.customImage?.previewUrl) URL.revokeObjectURL(state.accessories.customImage.previewUrl);
    setState(initialState);
  }, [state]);

  const handleGenerate = async () => {
    if (!state.userImage.file || (!state.topWear.text && !state.topWear.customImage && !state.topWear.inspirationUrl) || (!state.bottomWear.text && !state.bottomWear.customImage && !state.bottomWear.inspirationUrl)) {
      setState(s => ({ ...s, error: 'Please upload your photo and provide details for both top and bottom wear.' }));
      return;
    }

    setState(s => ({ ...s, isLoading: true, error: null, generatedImages: [] }));
    try {
      const newImages = await generateOutfitImages(state);
      setState(s => ({ ...s, generatedImages: newImages }));
    } catch (err: any) {
      console.error(err);
      setState(s => ({ ...s, error: `Failed to generate images. ${err.message}` }));
    } finally {
      setState(s => ({ ...s, isLoading: false }));
    }
  };

  const handleSurpriseMe = async () => {
    if (!state.userImage.file) {
      setState(s => ({ ...s, error: 'Please upload your photo before using "Surprise Me".' }));
      return;
    }
    setState(s => ({ ...s, isLoading: true, error: null, generatedImages: [] }));
    try {
      const surpriseOutfit = await getSurpriseOutfit(state.userImage.base64!, state.userImage.mimeType!, state.occasion, state.customOccasionPrompt);
      const newState: AppState = {
        ...state,
        topWear: { ...initialState.topWear, text: surpriseOutfit.topWear.description },
        bottomWear: { ...initialState.bottomWear, text: surpriseOutfit.bottomWear.description },
        accessories: { ...initialState.accessories, text: surpriseOutfit.accessories.map(a => a.description).join(', ') },
        isLoading: true, // keep loading for generation
      };
      setState(newState);
      // Now generate with the new outfit
      const newImages = await generateOutfitImages(newState);
      setState(s => ({ ...s, generatedImages: newImages }));

    } catch (err: any) {
      console.error(err);
      setState(s => ({ ...s, error: `Failed to generate a surprise outfit. ${err.message}` }));
    } finally {
      setState(s => ({ ...s, isLoading: false }));
    }
  };

  const updateGeneratedImage = (index: number, updates: Partial<GeneratedImage>) => {
    setState(prevState => {
      const updatedImages = [...prevState.generatedImages];
      if (updatedImages[index]) {
        updatedImages[index] = { ...updatedImages[index], ...updates };
      }
      return { ...prevState, generatedImages: updatedImages };
    });
  };

  const isGenerateDisabled = !state.userImage.file || (!state.topWear.text && !state.topWear.customImage && !state.topWear.inspirationUrl) || (!state.bottomWear.text && !state.bottomWear.customImage && !state.bottomWear.inspirationUrl) || state.isLoading;
  const isSurpriseMeDisabled = !state.userImage.file || state.isLoading;

  return (
    <div id="app-container">
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-20 border-b border-gray-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HeaderIcon />
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
              NewMe
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/50 flex flex-col space-y-6 h-fit animate-fade-in-up">
            {/* Section 1: Upload Photo */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 mr-3 text-lg font-bold text-white rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">1</span>
                Upload Your Photo
              </h2>
              <p className="text-sm text-gray-500 pl-11">Upload a clear, full-body photo of yourself.</p>
            </div>
            <ImageUploader
              userImage={state.userImage}
              onImageSelect={(image) => setState(s => ({ ...s, userImage: image, error: null }))}
            />

            <div className="pt-2">
              <button
                id="surprise-me-btn"
                onClick={handleSurpriseMe}
                disabled={isSurpriseMeDisabled}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg hover:shadow-gray-200/50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-pink-500 shadow-md shadow-gray-200/40 disabled:shadow-none"
              >
                <SurpriseMeIcon />
                Surprise Me
              </button>
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

            {/* Section 2: Describe Outfit */}
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 mr-3 text-lg font-bold text-white rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">2</span>
                    Design Your Outfit
                </h2>
                <p className="text-sm text-gray-500 pl-11">Choose an inspiration, upload your own, or describe an item.</p>
            </div>
            
            <div className="space-y-6">
                <OutfitItemInput 
                    label="Top Wear"
                    item={state.topWear}
                    onItemChange={(item) => setState(s => ({ ...s, topWear: item as OutfitItemState }))}
                    inspirationItems={TOP_WEAR_INSPIRATION}
                />
                <OutfitItemInput 
                    label="Bottom Wear"
                    item={state.bottomWear}
                    onItemChange={(item) => setState(s => ({ ...s, bottomWear: item as OutfitItemState }))}
                    inspirationItems={BOTTOM_WEAR_INSPIRATION}
                />
                <OutfitItemInput 
                    label="Accessories (Optional)"
                    item={state.accessories}
                    onItemChange={(item) => setState(s => ({ ...s, accessories: item as OutfitItemState }))}
                    inspirationItems={ACCESSORIES_INSPIRATION}
                />
            </div>

            {/* Section 3: Occasion */}
            <div className="space-y-1 pt-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 mr-3 text-lg font-bold text-white rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">3</span>
                Choose the Occasion
              </h2>
              <p className="text-sm text-gray-500 pl-11">Select an occasion to tailor the style.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {OCCASION_OPTIONS.map(option => (
                <button key={option.id} type="button" onClick={() => setState(s => ({ ...s, occasion: option.id }))} className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ${state.occasion === option.id ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-gray-300 hover:ring-pink-400'}`}>
                  <img src={option.imageUrl} alt={option.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
                    <span className="text-white text-xs font-semibold text-center">{option.label}</span>
                  </div>
                  {state.occasion === option.id && <div className="absolute inset-0 border-2 border-pink-500 rounded-xl"></div>}
                </button>
              ))}
            </div>
            <input type="text" value={state.customOccasionPrompt} onChange={e => setState(s => ({...s, customOccasionPrompt: e.target.value}))} placeholder="Optional: Describe a custom occasion..." className="mt-1 w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" />
            
            {/* Section 4: Background */}
            <div className="space-y-1 pt-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 mr-3 text-lg font-bold text-white rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">4</span>
                Choose Your Background
              </h2>
              <p className="text-sm text-gray-500 pl-11">Select a background, or describe your own.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BACKGROUND_OPTIONS.map(option => (
                     <button key={option.id} type="button" onClick={() => setState(s => ({...s, background: option.id}))} className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ${state.background === option.id ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-gray-300 hover:ring-pink-400'}`}>
                        <img src={option.imageUrl} alt={option.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
                            <span className="text-white text-xs font-semibold text-center">{option.label}</span>
                        </div>
                        {state.background === option.id && <div className="absolute inset-0 border-2 border-pink-500 rounded-xl"></div>}
                    </button>
                ))}
            </div>
            <input type="text" value={state.customBackgroundPrompt} onChange={e => setState(s => ({...s, customBackgroundPrompt: e.target.value}))} placeholder="Optional: Further describe the background..." className="mt-1 w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" />

            {/* Section 5: Image Count */}
            <div className="space-y-1 pt-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 mr-3 text-lg font-bold text-white rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">5</span>
                Number of Images
              </h2>
              <p className="text-sm text-gray-500 pl-11">Choose how many variations to generate.</p>
            </div>
            <div className="w-full bg-gray-100 p-1.5 rounded-full flex items-center justify-between">
              {[1, 2, 3, 4, 5].map(num => (
                <button key={num} type="button" onClick={() => setState(s => ({...s, imageCount: num}))} className={`flex-1 py-2 text-center rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none ${state.imageCount === num ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-md' : 'text-gray-600 hover:bg-white/80'}`}>
                  {num}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 pt-4">
              {state.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
              <div className="flex items-center space-x-4">
                <button
                  id="generate-btn"
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                  className="flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:shadow-xl hover:shadow-pink-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-pink-500 shadow-lg shadow-pink-500/20 disabled:shadow-none"
                >
                  <GenerateIcon />
                  <span id="generate-btn-text" className="ml-2">{state.isLoading ? 'Generating...' : 'Generate My Look'}</span>
                </button>
                <button id="reset-btn" onClick={handleReset} disabled={state.isLoading} className="px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/50 min-h-[500px] lg:min-h-0 sticky top-28 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <GeneratedImageViewer
              isLoading={state.isLoading}
              error={state.error}
              images={state.generatedImages}
              onImageClick={(index) => setActiveModalIndex(index)}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200/80 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Find a similar look on your favorite sites</h3>
            <p className="text-sm text-gray-500">Use the prompts from "Find This Look" to search on these platforms.</p>
          </div>
          <div className="flex justify-center items-center space-x-6 md:space-x-10">
              <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity duration-300"><AmazonIcon/></a>
              <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity duration-300"><FlipkartIcon /></a>
              <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity duration-300"><MeeshoIcon /></a>
              <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity duration-300"><MyntraIcon /></a>
          </div>
        </div>
      </footer>
      
      {activeModalIndex !== null && state.generatedImages[activeModalIndex] && (
        <ImagePreviewModal
          image={state.generatedImages[activeModalIndex]}
          onClose={() => setActiveModalIndex(null)}
          onUpdateImage={(updates) => updateGeneratedImage(activeModalIndex, updates)}
        />
      )}
    </div>
  );
};

export default App;
