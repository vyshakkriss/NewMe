import { GoogleGenAI, Type, Modality } from "@google/genai";

// --------------------------------------------------------------------------
// --- IMPORTANT: API KEY SETUP ---
// --------------------------------------------------------------------------
// 
// IMPORTANT: REPLACE "YOUR_GEMINI_API_KEY" WITH YOUR ACTUAL GEMINI API KEY
// 
// For local testing, you can paste your key here directly.
// 
// WARNING: Do NOT commit this file to a public repository (like GitHub) with
// your API key in it. For a real-world application, you would use a backend
// server to keep your API key secure.
// 
// --------------------------------------------------------------------------
const API_KEY = "YOUR_GEMINI_API_KEY";
// --------------------------------------------------------------------------

if (API_KEY === "YOUR_GEMINI_API_KEY") {
    alert("Please replace 'YOUR_GEMINI_API_KEY' with your actual API key in index.js");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- STATE MANAGEMENT ---
const initialState = {
  userImage: { file: null, base64: null, mimeType: null, previewUrl: null },
  topWear: { text: '', customImage: null, inspirationLabel: null },
  bottomWear: { text: '', customImage: null, inspirationLabel: null },
  accessories: [], // Array of { id, text, customImage }
  quickAccessories: [], // Array of strings e.g., ['Watches', 'Sunglasses']
  customQuickAccessory: '',
  occasion: 'party',
  customOccasionPrompt: '',
  background: 'studio',
  customBackgroundPrompt: '',
  imageCount: 4,
  generatedImages: [],
  isLoading: false,
  error: null,
  activeModalImage: null,
};

let state = { ...initialState };

const listeners = new Set();
const setState = (updater) => {
    const oldState = { ...state };
    const newState = typeof updater === 'function' ? updater(state) : updater;
    state = { ...oldState, ...newState };
    listeners.forEach(listener => listener());
};
const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

// --- CONSTANTS ---
const OCCASION_OPTIONS = [
  { id: 'party', label: 'Party', imageUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'beach', label: 'Beach', imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'festivals', label: 'Festivals', imageUrl: 'https://images.pexels.com/photos/19358792/pexels-photo-19358792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'weddings', label: 'Weddings', imageUrl: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'officewear', label: 'Office Wear', imageUrl: 'https://images.pexels.com/photos/4964952/pexels-photo-4964952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'casualwear', label: 'Casual', imageUrl: 'https://images.pexels.com/photos/5239067/pexels-photo-5239067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'vacation', label: 'Vacation', imageUrl: 'https://images.pexels.com/photos/914929/pexels-photo-914929.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'celebrity', label: 'Celebrity', imageUrl: 'https://images.pexels.com/photos/7069993/pexels-photo-7069993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'trending', label: 'Trending Fashion', imageUrl: 'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];
const QUICK_ACCESSORIES_OPTIONS = [
  { id: 'Sunglasses', label: 'Sunglasses', imageUrl: 'https://images.pexels.com/photos/2659705/pexels-photo-2659705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'Caps', label: 'Caps', imageUrl: 'https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'Watches', label: 'Watches', imageUrl: 'https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

const BACKGROUND_OPTIONS = [
  { id: 'studio', label: 'Neutral Studio', imageUrl: 'https://images.pexels.com/photos/842950/pexels-photo-842950.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'keep', label: 'Keep Original', imageUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'city_street', label: 'City Street', imageUrl: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'beach_sunset', label: 'Sunny Beach', imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'wedding', label: 'Wedding', imageUrl: 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'indoor', label: 'Indoor', imageUrl: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'party', label: 'Party', imageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'magazine', label: 'Magazine', imageUrl: 'https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 'green_screen', label: 'Green Screen', imageUrl: 'https://images.pexels.com/photos/5082558/pexels-photo-5082558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

// --- API SERVICE ---
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Could not read file as a data URL string.'));
        }
    };
    reader.onerror = error => reject(error);
});

const processItemForPrompt = (item, name) => {
    if (item.customImage?.base64 && item.customImage?.mimeType) {
        return {
            text: `For the ${name}, use the provided image of a ${item.text || name} as the primary reference. `,
            imagePart: { inlineData: { data: item.customImage.base64, mimeType: item.customImage.mimeType } }
        };
    }
    if (item.inspirationLabel) {
        return { 
            text: `For the ${name}, it should be a ${item.inspirationLabel}. ${item.text ? `Specifically, apply this detail: "${item.text}".` : ''} `, 
            imagePart: null 
        };
    }
    if (item.text) {
        return { text: `For the ${name}, the person should wear: ${item.text}. `, imagePart: null };
    }
    return { text: '', imagePart: null };
};

const generateOutfitImages = async () => {
    const basePromptText = "ULTRA-CRITICAL INSTRUCTION: Your single most important task is to preserve the person's face and identity from the original photo with 100% accuracy. DO NOT, under ANY CIRCUMSTANCES, change the person's face, facial features, head structure, skin tone, or hair. The person in the output image MUST be instantly and perfectly recognizable as the person in the input photo. Any alteration to the person's identity is a complete failure. After ensuring the face is unchanged, your secondary task is to redress the person with the new outfit in the specified background. IMPORTANT: Generate a full-body image of the person from head to toe, even if the original photo is cropped. The new look is as follows: ";
    let occasionPrompt = `The outfit should be appropriate for this occasion: ${state.occasion}. `;
    if (state.customOccasionPrompt) occasionPrompt += `Specifically, consider this description: "${state.customOccasionPrompt}". `;

    const backgroundPrompts = {
        keep: "Keep the original background from the person's photo. ",
        studio: "The background should be a clean, neutral studio setting. ",
        city_street: "The background should be a bustling city street. ",
        beach_sunset: "The background should be a beautiful sunny beach. ",
        wedding: "The background should be an elegant wedding venue. ",
        indoor: "The background should be a stylish indoor setting. ",
        party: "The background should be a lively party scene. ",
        magazine: "The background should look like a high-fashion magazine cover. The person should be the main feature. Add stylish magazine title text (like 'VOGUE' or 'STYLE') and headlines around the person. The overall aesthetic should be chic, professional, and eye-catching. ",
        green_screen: "The background MUST be a solid, vibrant green screen suitable for chroma keying. ",
    };
    let backgroundPrompt = backgroundPrompts[state.background] || '';
    if (state.customBackgroundPrompt) backgroundPrompt += `Further customize the background with this description: "${state.customBackgroundPrompt}". `;
    
    let outfitPrompt = '';
    const staticImageParts = [{ inlineData: { data: state.userImage.base64, mimeType: state.userImage.mimeType } }];

    const top = processItemForPrompt(state.topWear, 'top wear');
    outfitPrompt += top.text; if (top.imagePart) staticImageParts.push(top.imagePart);

    const bottom = processItemForPrompt(state.bottomWear, 'bottom wear');
    outfitPrompt += bottom.text; if (bottom.imagePart) staticImageParts.push(bottom.imagePart);
    
    let allAccessoriesText = [...state.quickAccessories, state.customQuickAccessory].filter(Boolean);
    state.accessories.forEach((acc, index) => {
        const accProcessed = processItemForPrompt(acc, `accessory ${index + 1}`);
        const accDesc = accProcessed.text.replace(`For the accessory ${index + 1}, the person should wear: `, '').replace('.', '');
        if (accDesc) allAccessoriesText.push(accDesc);
        if (accProcessed.imagePart) staticImageParts.push(accProcessed.imagePart);
    });

    if (allAccessoriesText.length > 0) {
        outfitPrompt += `For accessories, the person MUST strictly wear: ${allAccessoriesText.join(', ')}. `;
    }

    const imagePromises = [];
    for (let i = 0; i < state.imageCount; i++) {
        const variationPrompt = ` The outfit described above is a strict requirement. You MUST use the exact items described or shown in any provided images for top wear, bottom wear, and accessories. DO NOT change the style, color, or type of clothing in any way. For this image (variation ${i + 1} of ${state.imageCount}), render this exact outfit but show it from a slightly different camera angle or with a different pose (e.g., walking, standing still, looking left). The outfit itself MUST remain IDENTICAL across all generated images.`;
        
        const finalPrompt = basePromptText + occasionPrompt + outfitPrompt + backgroundPrompt + variationPrompt;
        
        const currentImageParts = [...staticImageParts, { text: finalPrompt }];

        imagePromises.push(ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: currentImageParts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        }));
    }

    const results = await Promise.all(imagePromises);
    const newImages = results.flatMap(res =>
        res.candidates?.[0]?.content?.parts
            .filter(part => part.inlineData)
            .map(part => ({
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType,
                src: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                shoppingPrompts: null,
                isLoadingPrompts: true,
            })) ?? []
    );

    if (newImages.length === 0) throw new Error("The model did not return any images. It might have refused the request due to safety policies.");
    return newImages;
};

const getShoppingPromptsForImage = async (base64, mimeType) => {
    const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { itemName: { type: Type.STRING }, prompt: { type: Type.STRING } }, required: ["itemName", "prompt"] } };
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [
            { text: "You are an expert at writing e-commerce search queries. Analyze the provided image and for each distinct fashion item (top, bottom, accessories) worn by the person, create a concise and effective search prompt to find similar products online. Your response must be a valid JSON array of objects, conforming to the schema." },
            { inlineData: { data: base64, mimeType } }
        ]},
        config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(result.text);
};

const getMultipleSurpriseOutfits = async (count) => {
    let occasionText = ` for a "${state.occasion}" occasion`;
    if (state.customOccasionPrompt) occasionText += `, specifically: "${state.customOccasionPrompt}"`;
    
    const selectedAccessories = [...state.quickAccessories, state.customQuickAccessory].filter(Boolean);
    let accessoriesInstruction = '';
    if (selectedAccessories.length > 0) {
        accessoriesInstruction = `**CRITICAL:** You MUST include the following accessories in EVERY outfit description: ${selectedAccessories.join(', ')}. You can add other matching accessories as well.`;
    } else {
        accessoriesInstruction = `For each outfit, include a few creative and matching accessories (e.g., jewelry, bag, hat) that complement the look.`;
    }

    const prompt = `You are a world-class, creative fashion stylist AI. Your task is to act as a personal stylist for the person in the provided image.
        **Goal:** Generate ${count} COMPLETELY DIFFERENT and stylish outfit descriptions suited to them${occasionText}. Each outfit must be unique in its core items, color scheme, fabric, and overall theme.
        **Instructions:** 
        1. Analyze the person in the image. 
        2. For each of the ${count} outfits, create a complete description including a top and a bottom that are highly relevant to the occasion.
        3. ${accessoriesInstruction}
        4. Be highly creative and ensure the outfits are distinct from one another.
        Your final response MUST be a single, valid JSON array of objects, conforming to the schema. Do not include any other text or explanations.`;
        
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                topWear: { type: Type.STRING, description: "A concise description of the top wear." },
                bottomWear: { type: Type.STRING, description: "A concise description of the bottom wear." },
                accessories: { type: Type.STRING, description: "A concise description of the accessories, combined into one string." }
            },
            required: ["topWear", "bottomWear", "accessories"]
        }
    };
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ inlineData: { data: state.userImage.base64, mimeType: state.userImage.mimeType } }, { text: prompt }] },
        config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(result.text);
};

const generateImageForOutfitDescription = async (outfit) => {
    const basePromptText = "ULTRA-CRITICAL INSTRUCTION: Your single most important task is to preserve the person's face and identity from the original photo with 100% accuracy. DO NOT, under ANY CIRCUMSTANCES, change the person's face, facial features, head structure, skin tone, or hair. The person in the output image MUST be instantly and perfectly recognizable as the person in the input photo. Any alteration to the person's identity is a complete failure. After ensuring the face is unchanged, your secondary task is to redress the person with the new outfit in the specified background. IMPORTANT: Generate a full-body image of the person from head to toe, even if the original photo is cropped. The new look is as follows: ";
    let occasionPrompt = `The outfit should be appropriate for this occasion: ${state.occasion}. `;
    if (state.customOccasionPrompt) occasionPrompt += `Specifically, consider this description: "${state.customOccasionPrompt}". `;

    const backgroundPrompts = {
        keep: "Keep the original background from the person's photo. ",
        studio: "The background should be a clean, neutral studio setting. ",
        city_street: "The background should be a bustling city street. ",
        beach_sunset: "The background should be a beautiful sunny beach. ",
        wedding: "The background should be an elegant wedding venue. ",
        indoor: "The background should be a stylish indoor setting. ",
        party: "The background should be a lively party scene. ",
        magazine: "The background should look like a high-fashion magazine cover. The person should be the main feature. Add stylish magazine title text (like 'VOGUE' or 'STYLE') and headlines around the person. The overall aesthetic should be chic, professional, and eye-catching. ",
        green_screen: "The background MUST be a solid, vibrant green screen suitable for chroma keying. ",
    };
    let backgroundPrompt = backgroundPrompts[state.background] || '';
    if (state.customBackgroundPrompt) backgroundPrompt += `Further customize the background with this description: "${state.customBackgroundPrompt}". `;
    
    const imageParts = [{ inlineData: { data: state.userImage.base64, mimeType: state.userImage.mimeType } }];
    let outfitPrompt = `The person should wear: Top: ${outfit.topWear}. Bottom: ${outfit.bottomWear}. Accessories: ${outfit.accessories}. `;

    const finalPrompt = basePromptText + occasionPrompt + outfitPrompt + backgroundPrompt + ` Generate a high-quality, photorealistic image. Ensure the pose or camera angle is interesting.`;
    imageParts.push({ text: finalPrompt });

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: imageParts },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });
    
    const newImagePart = result.candidates?.[0]?.content?.parts.find(part => part.inlineData);
    if (!newImagePart) return null;

    return {
        base64: newImagePart.inlineData.data,
        mimeType: newImagePart.inlineData.mimeType,
        src: `data:${newImagePart.inlineData.mimeType};base64,${newImagePart.inlineData.data}`,
        shoppingPrompts: null,
        isLoadingPrompts: true,
    };
};


// --- UI COMPONENTS & RENDER LOGIC ---
const renderImageUploader = (container, image, onSelect, error) => {
    let isDragging = false;
    const update = () => {
        container.innerHTML = `
            <label for="file-upload" class="relative block w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-gray-50/80 hover:border-pink-500'}">
                ${image.previewUrl ? `
                    <div class="w-full h-full">
                        <img src="${image.previewUrl}" alt="Preview" class="w-full h-full object-contain rounded-xl" />
                    </div>
                ` : `
                    <div class="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg class="w-12 h-12 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" /></svg>
                        <span class="mt-2 text-sm">Drag & drop an image, or click to select</span>
                        <span class="text-xs">PNG, JPG, WEBP up to 4MB</span>
                    </div>
                `}
            </label>
            <input id="file-upload" type="file" accept="image/*" class="sr-only" />
            ${error ? `<p class="text-sm text-red-500 mt-2">${error}</p>` : ''}
        `;
        const label = container.querySelector('label');
        const input = container.querySelector('#file-upload');
        const handleFile = async (file) => {
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                onSelect(null, 'Please select a valid image file (PNG, JPG, etc.).'); return;
            }
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                onSelect(null, 'Image size should be less than 4MB.'); return;
            }
            try {
                const base64 = await fileToBase64(file);
                if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
                onSelect({ file, base64, mimeType: file.type, previewUrl: URL.createObjectURL(file) });
            } catch {
                onSelect(null, 'Could not process the image file.');
            }
        };
        label.addEventListener('dragover', e => { e.preventDefault(); isDragging = true; update(); });
        label.addEventListener('dragleave', e => { e.preventDefault(); isDragging = false; update(); });
        label.addEventListener('drop', e => { e.preventDefault(); isDragging = false; update(); handleFile(e.dataTransfer.files[0]); });
        input.addEventListener('change', e => { handleFile(e.target.files[0]); e.target.value = ''; });
    };
    update();
};

const renderSimpleOutfitItem = (container, itemKey, label) => {
    const itemState = state[itemKey];

    container.innerHTML = `
        <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">${label}</label>
            <div class="space-y-2">
                 <button
                    type="button"
                    class="upload-btn relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ring-1 ${itemState.customImage ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-dashed ring-gray-300 hover:ring-pink-400'}"
                >
                    ${itemState.customImage ? `
                        <img src="${itemState.customImage.previewUrl}" alt="Custom upload" class="w-full h-full object-cover" />
                        <div class="remove-custom-image absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                    ` : `
                        <div class="flex flex-col items-center justify-center h-full text-gray-500 hover:text-pink-600 transition-colors">
                            <svg class="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" /></svg>
                            <span class="mt-1 text-xs font-semibold text-center">Upload Your Own</span>
                        </div>
                    `}
                </button>
                <input type="file" class="custom-upload-input hidden" accept="image/*" />
                <input
                    type="text"
                    class="text-input w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                    placeholder="Or describe it with text... e.g., 'dark wash denim jeans'"
                    value="${itemState.text}"
                />
            </div>
        </div>
    `;

    const fileInput = container.querySelector('.custom-upload-input');
    container.querySelector('.upload-btn').addEventListener('click', () => fileInput.click());
    if (container.querySelector('.remove-custom-image')) {
        container.querySelector('.remove-custom-image').addEventListener('click', (e) => {
            e.stopPropagation();
            const currentItem = state[itemKey];
            if (currentItem.customImage?.previewUrl) URL.revokeObjectURL(currentItem.customImage.previewUrl);
            setState(s => ({ ...s, [itemKey]: { ...s[itemKey], customImage: null } }));
        });
    }

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const currentItem = state[itemKey];
            if (currentItem.customImage?.previewUrl) URL.revokeObjectURL(currentItem.customImage.previewUrl);
            const base64 = await fileToBase64(file);
            const previewUrl = URL.createObjectURL(file);
            setState(s => ({
                ...s,
                [itemKey]: {
                    ...s[itemKey],
                    customImage: { file, base64, mimeType: file.type, previewUrl },
                }
            }));
        }
    });

    container.querySelector('.text-input').addEventListener('input', e => {
        setState(s => ({ ...s, [itemKey]: { ...s[itemKey], text: e.target.value } }));
    });
};

const renderSingleAccessoryItem = (container, accessory, index) => {
    container.innerHTML = `
        <div class="flex items-start space-x-2">
            <div class="flex-grow space-y-2">
                <button
                    type="button"
                    class="upload-btn relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ring-1 ${accessory.customImage ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-dashed ring-gray-300 hover:ring-pink-400'}"
                >
                    ${accessory.customImage ? `
                        <img src="${accessory.customImage.previewUrl}" alt="Custom accessory" class="w-full h-full object-cover" />
                        <div class="remove-custom-image absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                    ` : `
                        <div class="flex flex-col items-center justify-center h-full text-gray-500 hover:text-pink-600 transition-colors p-1">
                             <svg class="w-6 h-6 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" /></svg>
                            <span class="mt-1 text-[10px] font-semibold text-center">Upload</span>
                        </div>
                    `}
                </button>
                <input type="file" class="custom-upload-input hidden" accept="image/*" />
                <input type="text"
                    class="text-input w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                    placeholder="Or describe it..."
                    value="${accessory.text}"
                />
            </div>
            <button class="remove-accessory-btn self-center mt-6 p-2 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors leading-none" aria-label="Remove accessory">
                &times;
            </button>
    `;

    const fileInput = container.querySelector('.custom-upload-input');
    container.querySelector('.upload-btn').addEventListener('click', () => fileInput.click());
    if (container.querySelector('.remove-custom-image')) {
        container.querySelector('.remove-custom-image').addEventListener('click', (e) => {
            e.stopPropagation();
            const currentItem = state.accessories[index];
            if (currentItem.customImage?.previewUrl) URL.revokeObjectURL(currentItem.customImage.previewUrl);
            const newAccessories = [...state.accessories];
            newAccessories[index] = { ...newAccessories[index], customImage: null };
            setState(s => ({ ...s, accessories: newAccessories }));
        });
    }

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const currentItem = state.accessories[index];
            if (currentItem.customImage?.previewUrl) URL.revokeObjectURL(currentItem.customImage.previewUrl);
            const base64 = await fileToBase64(file);
            const previewUrl = URL.createObjectURL(file);
            const newAccessories = [...state.accessories];
            newAccessories[index] = { ...newAccessories[index], customImage: { file, base64, mimeType: file.type, previewUrl } };
            setState(s => ({ ...s, accessories: newAccessories }));
        }
    });

    container.querySelector('.text-input').addEventListener('input', e => {
        const newAccessories = [...state.accessories];
        newAccessories[index] = { ...newAccessories[index], text: e.target.value };
        setState(s => ({ ...s, accessories: newAccessories }));
    });
    
    container.querySelector('.remove-accessory-btn').addEventListener('click', () => {
        const currentItem = state.accessories[index];
        if (currentItem.customImage?.previewUrl) URL.revokeObjectURL(currentItem.customImage.previewUrl);
        setState(s => ({ ...s, accessories: s.accessories.filter((_, i) => i !== index) }));
    });
};

const renderAccessories = (container) => {
    const canAddMore = state.accessories.length < 5;
    container.innerHTML = `
        <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">Accessories (Optional)</label>
            <div id="accessories-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <button
                id="add-accessory-btn"
                type="button"
                class="w-full px-4 py-2 border border-dashed border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:border-pink-500 hover:text-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                ${!canAddMore ? 'disabled' : ''}
            >
                + Add Accessory ${!canAddMore ? '(Max 5)' : ''}
            </button>
        </div>
    `;

    const listContainer = container.querySelector('#accessories-list');
    state.accessories.forEach((acc, index) => {
        const itemContainer = document.createElement('div');
        listContainer.appendChild(itemContainer);
        renderSingleAccessoryItem(itemContainer, acc, index);
    });

    container.querySelector('#add-accessory-btn').addEventListener('click', () => {
        if (state.accessories.length < 5) {
            setState(s => ({
                ...s,
                accessories: [...s.accessories, { id: Date.now(), text: '', customImage: null }]
            }));
        }
    });
};

const renderQuickAddAccessories = (container) => {
    container.innerHTML = `
        <div class="grid grid-cols-3 sm:grid-cols-3 gap-3">
            ${QUICK_ACCESSORIES_OPTIONS.map(opt => `
                <button data-id="${opt.id}" class="quick-accessory-btn relative aspect-square rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ${state.quickAccessories.includes(opt.id) ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-gray-300 hover:ring-pink-400'}">
                    <img src="${opt.imageUrl}" alt="${opt.label}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
                        <span class="text-white text-xs font-semibold text-center">${opt.label}</span>
                    </div>
                    ${state.quickAccessories.includes(opt.id) ? '<div class="absolute inset-0 border-2 border-pink-500 rounded-xl"></div>' : ''}
                </button>
            `).join('')}
        </div>
        <input type="text" id="custom-quick-accessory-prompt" value="${state.customQuickAccessory}" placeholder="Optional: Add other accessories..." class="mt-3 w-full bg-gray-50/80 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200" />
    `;

    container.querySelectorAll('.quick-accessory-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const current = state.quickAccessories;
            const newSelection = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
            setState({ quickAccessories: newSelection });
        });
    });

    container.querySelector('#custom-quick-accessory-prompt').addEventListener('input', e => setState({ customQuickAccessory: e.target.value }));
};

const LOADING_MESSAGES = ["Warming up the AI stylist...", "Sketching your new look...", "Analyzing your style...", "Generating different poses and angles...", "Polishing the final images...", "Almost ready for your big reveal!"];
let loadingMessageInterval;
const renderOutputViewer = (container) => {
    clearInterval(loadingMessageInterval);
    if (state.isLoading) {
        let msgIndex = 0;
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div class="relative w-24 h-24">
                  <div class="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-10"></div>
                  <div class="absolute inset-0 rounded-full animate-spin" style="background: conic-gradient(from 90deg at 50% 50%, rgba(255,255,255,0) 0%, #ec4899 100%)"></div>
                  <div class="absolute inset-2 bg-white rounded-full"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" class="w-8 h-8 text-pink-500"><path d="M12 2l2.35 6.86h7.15l-5.77 4.2 2.35 6.88-5.78-4.2-5.79 4.2 2.36-6.88-5.77-4.2h7.15L12 2z"/></svg>
                  </div>
                </div>
                <p class="text-lg font-semibold text-gray-900 mt-6">Generating Your Virtual Try-On</p>
                <p id="loading-message" class="mt-2 text-sm transition-opacity duration-500">${LOADING_MESSAGES[msgIndex]}</p>
            </div>`;
        const msgEl = container.querySelector('#loading-message');
        loadingMessageInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
            msgEl.textContent = LOADING_MESSAGES[msgIndex];
        }, 2500);
        return;
    }
    
    if (state.error && state.generatedImages.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center text-red-700 p-4 bg-red-50 rounded-xl">
                <h3 class="text-lg font-semibold text-red-800">An Error Occurred</h3>
                <p class="mt-2 text-sm max-w-sm">${state.error}</p>
            </div>`;
        return;
    }

    if (state.generatedImages.length > 0) {
        container.innerHTML = `
            <div class="h-full overflow-y-auto pr-2 -mr-2">
                <h2 class="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" class="w-5 h-5"><path d="M12 2l2.35 6.86h7.15l-5.77 4.2 2.35 6.88-5.78-4.2-5.79 4.2 2.36-6.88-5.77-4.2h7.15L12 2z"/></svg>
                    <span class="ml-2">Your New Look</span>
                </h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    ${state.generatedImages.map((img, index) => `
                        <div data-index="${index}" class="aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden opacity-0 animate-fade-in-up group relative shadow-md cursor-pointer generated-image" style="animation-delay: ${index * 150}ms">
                            <img src="${img.src}" alt="Generated outfit ${index + 1}" class="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" />
                             <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                <div class="py-2 px-4 bg-white/90 text-gray-800 font-semibold rounded-full text-sm backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                                    View
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        container.querySelectorAll('.generated-image').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index, 10);
                setState({ activeModalImage: state.generatedImages[index] });
            });
        });
        return;
    }

    container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl p-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <h3 class="mt-4 text-lg font-semibold text-gray-700">Your Generated Images Will Appear Here</h3>
            <p class="mt-1 text-sm max-w-xs">Fill out the form and click "Generate My Look" to see the magic happen!</p>
        </div>`;
};

let copiedPrompt = null;
const renderImagePreviewModal = (container) => {
    const image = state.activeModalImage;
    if (!image) {
        container.classList.add('hidden');
        return;
    }
    container.classList.remove('hidden');

    const shoppingQuery = image.shoppingPrompts?.map(p => p.prompt).join(' ') || '';
    const encodedQuery = encodeURIComponent(shoppingQuery);

    const renderPrompts = () => {
        if (image.isLoadingPrompts) {
            return `
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <svg class="animate-spin h-5 w-5 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Generating keywords...</span>
                </div>`;
        }
        if (!image.shoppingPrompts || image.shoppingPrompts.length === 0) {
            return `<p class="text-sm text-gray-500">Shopping keywords could not be generated for this image.</p>`;
        }
        return `
            <div class="space-y-3">
            ${image.shoppingPrompts.map((p, i) => `
                <div key=${i} class="flex items-center justify-between bg-gray-50/80 p-2 rounded-lg border border-gray-200/80">
                    <div class="flex-1 mr-2">
                        <p class="text-xs font-semibold text-gray-500">${p.itemName}</p>
                        <p class="text-sm text-gray-800 font-medium">${p.prompt}</p>
                    </div>
                    <button data-prompt="${p.prompt}" class="copy-btn p-2 text-gray-500 hover:text-pink-600 bg-gray-100 hover:bg-pink-100 rounded-md transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500" aria-label="Copy prompt">
                        ${copiedPrompt === p.prompt ?
                            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>` :
                            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
                        }
                    </button>
                </div>
            `).join('')}
            </div>`;
    };
    
    const renderShoppingLinks = () => {
        if (image.isLoadingPrompts || !image.shoppingPrompts || image.shoppingPrompts.length === 0) {
            return '';
        }
        return `
            <div class="mt-6">
                <h4 class="text-sm font-semibold text-gray-600 mb-3 text-center">Search On:</h4>
                <div class="flex justify-center items-center space-x-4">
                    <a href="https://www.amazon.com/s?k=${encodedQuery}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors" title="Search on Amazon"><svg height="20" viewBox="0 0 102 31" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M29.98 20.255c-4.417 0-6.223-2.614-6.282-5.943h11.95c.01-.157.01-.314.01-.48 0-5.59-3.906-9.617-9.656-9.617C19.7 4.215 15 8.658 15 14.332c0 5.492 4.093 9.77 10.352 9.77 3.867 0 6.64-1.805 8.01-3.69l-2.076-1.564c-.95.99-2.295 1.835-3.64 1.835-1.785 0-2.858-.91-3.323-1.666l8.63-.03Zm-8.62-7.59c.284-1.637 1.63-2.79 3.324-2.79 1.64 0 2.927 1.153 3.197 2.79h-6.52Z"></path><path d="M43.792 23.857h-3.41V4.46h3.41v19.397Z"></path><path d="M54.192 14.332c0-5.55 3.79-9.617 9.53-9.617 5.75 0 9.54 4.067 9.54 9.617s-3.79 9.617-9.54 9.617c-5.74 0-9.53-4.067-9.53-9.617Zm15.75 0c0-3.64-.99-6.3-5.93-6.3-5.068 0-6.173 2.72-6.173 6.3 0 3.514 1.012 6.3 6.173 6.3 4.94 0 5.93-2.66 5.93-6.3Z"></path><path d="M85.034 10.74c1.325-1.393 2.53-1.606 4.015-1.606 1.765 0 2.5.58 2.5 1.836v12.642h-3.41V11.23c0-.687-.107-1.123-1.107-1.123-.625 0-1.178.294-1.578.852v12.653h-3.41V9.41h3.01v1.33Z"></path><path d="M3.593 23.857 7.18 4.46h3.69l3.587 19.397H11.23l-.76-4.54H6.12l-.76 4.54H3.593Zm4.46-7.39h.06L9.2 8.427 10.287 16.467H8.053Z"></path></svg></a>
                    <a href="https://www.flipkart.com/search?q=${encodedQuery}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Search on Flipkart"><svg height="20" viewBox="0 0 102 31" fill="#2874F0" xmlns="http://www.w3.org/2000/svg"><path d="M22.95 21.35c2.7 0 4.2-1.6 4.2-3.8 0-2.3-1.5-3.8-4.2-3.8h-2.6v7.6h2.6Zm-2.6-10.1h2.8c2.4 0 3.8-1.3 3.8-3.3 0-2-1.4-3.3-3.8-3.3h-2.8v6.6Z"></path><path d="M52.35 3.65h-5.2v17.7h5.2v-17.7Z"></path><path d="M57.65 14.05v-10.4h5.2v10.2c0 3.2 1.8 4.9 4.8 4.9s4.8-1.7 4.8-4.9V3.65h5.2v10.4c0 6-4.3 8.3-10 8.3s-10-2.3-10-8.3Z"></path><path d="M96.75 14.15c0 3.5 2 5.1 4.8 5.1s4.8-1.6 4.8-5.1V3.65h-5.2v10.3c0 1.2-.5 1.9-1.9 1.9s-1.9-.7-1.9-1.9V3.65h-5.2v10.5h.1Z"></path></svg></a>
                    <a href="https://www.myntra.com/${encodedQuery}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Search on Myntra"><svg height="20" viewBox="0 0 102 31" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path d="M41.7 13.1c0-.2-.1-.4-.2-.5l-3.1-3.1c-1.1-1.2-2.7-1.8-4.3-1.8h-4.9c-.3 0-.6.1-.8.4l-3.9 4.3v.1l-4 4.3c-.2.3-.2.6 0 .8.1.1.2.2.4.2h3.4c.2 0 .4-.1.5-.2l3.1-3.1c1.2-1.2 2.7-1.8 4.4-1.8h4.8c.3 0 .6-.1.8-.4l3.9-4.2v-.1l.1-.1Z"></path><path d="m39.2 15.6-.1.1-3.9 4.2c-.2.3-.5.4-.8.4h-4.8c-1.7 0-3.3-.6-4.4-1.8l-3.1-3.1c-.1-.1-.3-.2-.5-.2h-3.4c-.2 0-.3 0-.4-.2-.2-.2-.2-.5 0-.8l4-4.3v-.1l3.9-4.3c.2-.3.5-.4.8-.4h4.9c1.6 0 3.1.6 4.3 1.8l3.1 3.1c.1.1.2.3.2.5l-4 4.3Z"></path><path d="M51.9 13.1c0-.2-.1-.4-.2-.5l-3.1-3.1c-1.2-1.2-2.7-1.8-4.3-1.8h-4.9c-.3 0-.6.1-.8.4l-3.9 4.3v.1l-4 4.3c-.2.3-.2.6 0 .8.1.1.2.2.4.2h3.4c.2 0 .4-.1.5-.2l3.1-3.1c1.2-1.2 2.7-1.8 4.4-1.8h4.8c.3 0 .6-.1.8-.4l3.9-4.2v-.1l.1-.1Z"></path><path d="m49.4 15.6-.1.1-3.9 4.2c-.2.3-.5.4-.8.4h-4.8c-1.7 0-3.3-.6-4.4-1.8l-3.1-3.1c-.1-.1-.3-.2-.5-.2h-3.4c-.2 0-.3 0-.4-.2-.2-.2-.2-.5 0-.8l4-4.3v-.1l3.9-4.3c.2-.3.5-.4.8-.4h4.9c1.6 0 3.1.6 4.3 1.8l3.1 3.1c.1.1.2.3.2.5l-4 4.3Z"></path><path d="M72.9 20.3h2.3V8h-2.3v12.3Z"></path><path d="m63 20.3h2.3V8h-2.3v12.3Z"></path><path d="M83 20.3h2.3l-5.6-12.3h-2.3l-5.6 12.3h2.4l1.2-2.7h6.1l1.1 2.7Zm-5.3-4.4 1.9-4.4 1.9 4.4h-3.8Z"></path><path d="m96.3 8-6.1 12.3h2.4l4.9-10v10h2.2V8h-3.4Z"></path></svg></a>
                    <a href="https://www.meesho.com/search?q=${encodedQuery}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Search on Meesho"><svg height="20" viewBox="0 0 102 31" fill="#F43397" xmlns="http://www.w3.org/2000/svg"><path d="M21.94 3.7c3.3 0 5.4 1.9 5.4 4.7v9h-3.2v-9c0-1.2-.8-1.9-2.2-1.9s-2.2.7-2.2 1.9v9h-3.2v-9c0-2.8 2.1-4.7 5.4-4.7Z"></path><path d="M43.04 3.7c2.1 0 3.4.8 4.1 2l-2.4 1.5c-.3-.5-.9-.8-1.7-.8s-1.8.3-1.8 1.1v.2c.8-.3 1.8-.4 2.8-.4 3.3 0 5.2 1.6 5.2 4.6 0 2.9-2.1 4.7-5.4 4.7-3.4 0-5.6-1.9-5.6-4.8 0-3.3 2.1-5.1 4.8-5.1Zm-2.2 8.3c0 1.3.8 2 2.2 2s2.2-.7 2.2-2-1-2-2.3-2c-1.2 0-2.1.6-2.1 2Z"></path><path d="M59.34 3.7c3.3 0 5.4 1.9 5.4 4.7v9h-3.2v-9c0-1.2-.8-1.9-2.2-1.9s-2.2.7-2.2 1.9v9h-3.2v-9c0-2.8 2.1-4.7 5.4-4.7Z"></path><path d="M90.34 3.7c3.3 0 5.4 1.9 5.4 4.7 0 1.9-.9 3.2-2.4 4l2.7 4.7h-3.7l-2.2-4.1h-1.6v4.1h-3.2V3.7h5Zm-2.2 6.5c1.2 0 2.1-.6 2.1-1.6s-.9-1.6-2.1-1.6h-1.6v3.2h1.6Z"></path></svg></a>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div id="modal-content" class="relative bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden modal-animate-scale-in">
            <div class="md:w-2/3 h-1/2 md:h-full bg-gray-100 flex items-center justify-center">
              <img src="${image.src}" alt="Generated outfit preview" class="w-full h-full object-contain" />
            </div>
            <div class="md:w-1/3 h-1/2 md:h-full flex flex-col">
              <div class="p-6 flex-grow overflow-y-auto" id="shopping-prompts-container">
                <h3 class="text-xl font-bold text-gray-800 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mr-2 text-purple-500"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z"></path><path d="M7 7h.01"></path></svg> Find This Look
                </h3>
                ${renderPrompts()}
                ${renderShoppingLinks()}
              </div>
              <div class="p-6 border-t border-gray-200/80">
                <div class="flex items-center space-x-3">
                  ${navigator.share ? `<button id="share-btn" class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none" aria-label="Share image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share</button>` : ''}
                  <button id="download-btn" class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none" aria-label="Download image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download</button>
                </div>
              </div>
            </div>
            <button id="close-modal-btn" class="absolute top-3 right-3 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close preview"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
    `;

    container.addEventListener('click', (e) => { if(e.target === container) setState({ activeModalImage: null }); });
    container.querySelector('#modal-content').addEventListener('click', e => e.stopPropagation());
    container.querySelector('#close-modal-btn').addEventListener('click', () => setState({ activeModalImage: null }));
    container.querySelector('#download-btn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `newme-try-on-${Date.now()}.png`;
        link.click();
    });
    if (navigator.share) {
        container.querySelector('#share-btn').addEventListener('click', async () => {
             try {
                const response = await fetch(image.src);
                const blob = await response.blob();
                const file = new File([blob], `newme-try-on-${Date.now()}.png`, { type: blob.type });
                const shareData = { files: [file], title: 'My New Look from NewMe!', text: 'Check out this virtual try-on outfit I created with AI.' };
                if (navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                }
            } catch (error) {
                if (error.name !== 'AbortError') alert('An error occurred while sharing the image.');
            }
        });
    }
    
    container.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        navigator.clipboard.writeText(prompt);
        copiedPrompt = prompt;
        renderImagePreviewModal(container);
        setTimeout(() => { copiedPrompt = null; renderImagePreviewModal(container); }, 2000);
    }));
};

// --- MAIN RENDER FUNCTION ---
const renderApp = () => {
    // Buttons
    const generateBtn = document.getElementById('generate-btn');
    const surpriseMeBtn = document.getElementById('surprise-me-btn');
    const generateBtnText = document.getElementById('generate-btn-text');
    const isOutfitSelected = (item) => item.text || item.customImage;
    const isGenerateDisabled = !state.userImage.file || !isOutfitSelected(state.topWear) || !isOutfitSelected(state.bottomWear) || state.isLoading;
    
    generateBtn.disabled = isGenerateDisabled;
    surpriseMeBtn.disabled = !state.userImage.file || state.isLoading;
    generateBtnText.textContent = state.isLoading ? 'Generating...' : 'Generate My Look';

    document.getElementById('error-message').textContent = state.error || '';

    // Components
    renderImageUploader(document.getElementById('image-uploader-container'), state.userImage, (image, err) => {
        if (err) setState({ error: err });
        else setState({ userImage: image, error: null });
    }, state.error);
    
    const outfitContainer = document.getElementById('outfit-input-container');
    outfitContainer.innerHTML = '';
    const combinedWearContainer = document.createElement('div');
    combinedWearContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
    const topWearSimpleDiv = document.createElement('div');
    const bottomWearSimpleDiv = document.createElement('div');
    combinedWearContainer.append(topWearSimpleDiv, bottomWearSimpleDiv);

    const accessoriesContainer = document.createElement('div');
    accessoriesContainer.className = "pt-6"; 

    outfitContainer.append(combinedWearContainer, accessoriesContainer);

    renderSimpleOutfitItem(topWearSimpleDiv, 'topWear', 'Top Wear');
    renderSimpleOutfitItem(bottomWearSimpleDiv, 'bottomWear', 'Bottom Wear');
    renderAccessories(accessoriesContainer);

    renderQuickAddAccessories(document.getElementById('quick-accessories-container'));

    const occasionContainer = document.getElementById('occasion-options-container');
    occasionContainer.innerHTML = OCCASION_OPTIONS.map(option => `
        <button data-id="${option.id}" class="occasion-btn relative aspect-video rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ${state.occasion === option.id ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-gray-300 hover:ring-pink-400'}">
            <img src="${option.imageUrl}" alt="${option.label}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
                <span class="text-white text-xs font-semibold text-center">${option.label}</span>
            </div>
            ${state.occasion === option.id ? '<div class="absolute inset-0 border-2 border-pink-500 rounded-xl"></div>' : ''}
        </button>`).join('');
    occasionContainer.querySelectorAll('.occasion-btn').forEach(b => b.addEventListener('click', () => setState({ occasion: b.dataset.id })));

    const backgroundContainer = document.getElementById('background-options-container');
    backgroundContainer.innerHTML = BACKGROUND_OPTIONS.map(option => `
         <button data-id="${option.id}" class="background-btn relative aspect-video rounded-xl overflow-hidden transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-pink-500 group ${state.background === option.id ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-gray-300 hover:ring-pink-400'}">
            <img src="${option.imageUrl}" alt="${option.label}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
                <span class="text-white text-xs font-semibold text-center">${option.label}</span>
            </div>
            ${state.background === option.id ? '<div class="absolute inset-0 border-2 border-pink-500 rounded-xl"></div>' : ''}
        </button>`).join('');
    backgroundContainer.querySelectorAll('.background-btn').forEach(b => b.addEventListener('click', () => setState({ background: b.dataset.id })));
    
    const imageCountContainer = document.getElementById('image-count-container');
    imageCountContainer.innerHTML = [4, 6, 10].map(num => `
        <button data-count="${num}" class="image-count-btn flex-1 py-2 text-center rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none ${state.imageCount === num ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-md' : 'text-gray-600 hover:bg-white/80'}">
            ${num}
        </button>`).join('');
    imageCountContainer.querySelectorAll('.image-count-btn').forEach(b => b.addEventListener('click', () => setState({ imageCount: parseInt(b.dataset.count, 10) })));

    renderOutputViewer(document.getElementById('output-container'));
    renderImagePreviewModal(document.getElementById('image-preview-modal'));
};

// --- EVENT HANDLERS & INITIALIZATION ---
const handleGenerate = async () => {
    if (!state.userImage.file) { setState({ error: 'Please upload your photo.'}); return; }
    const isOutfitSelected = (item) => item.text || item.customImage;
    if (!isOutfitSelected(state.topWear) || !isOutfitSelected(state.bottomWear)) {
        setState({ error: 'Please provide details for both top and bottom wear.'}); return;
    }
    setState({ isLoading: true, error: null, generatedImages: [] });
    try {
        const newImages = await generateOutfitImages();
        setState({ generatedImages: newImages, isLoading: false });
    } catch (err) {
        console.error(err);
        setState({ error: `Failed to generate images. ${err.message}`, isLoading: false });
    }
};

const handleSurpriseMe = async () => {
    if (!state.userImage.file) { setState({ error: 'Please upload your photo first.' }); return; }
    setState({ isLoading: true, error: null, generatedImages: [] });
    try {
        // 1. Get multiple distinct outfit descriptions from the AI
        const surpriseOutfits = await getMultipleSurpriseOutfits(state.imageCount);
        if (!surpriseOutfits || surpriseOutfits.length === 0) {
            throw new Error("Could not generate surprise outfit ideas from the AI.");
        }

        // 2. Generate an image for each distinct description in parallel
        const imagePromises = surpriseOutfits.map(outfit => generateImageForOutfitDescription(outfit));
        const newImages = (await Promise.all(imagePromises)).filter(Boolean); // Filter out any null results from failed generations

        if (newImages.length === 0) {
            throw new Error("The model did not return any images for the surprise outfits.");
        }

        setState({ generatedImages: newImages, isLoading: false });
    } catch (err) {
        console.error(err);
        setState({ error: `Failed to generate a surprise outfit. ${err.message}`, isLoading: false });
    }
};

const fetchAndSetShoppingPrompts = async (imageIndex) => {
    const image = state.generatedImages[imageIndex];
    if (!image || !image.isLoadingPrompts) return;
    try {
        const prompts = await getShoppingPromptsForImage(image.base64, image.mimeType);
        setState(s => {
            const updatedImages = [...s.generatedImages];
            updatedImages[imageIndex] = { ...updatedImages[imageIndex], shoppingPrompts: prompts, isLoadingPrompts: false };
            const activeModalImage = s.activeModalImage?.src === image.src ? updatedImages[imageIndex] : s.activeModalImage;
            return { ...s, generatedImages: updatedImages, activeModalImage };
        });
    } catch (e) {
        console.error("Failed to get shopping prompts", e);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-btn').addEventListener('click', handleGenerate);
    document.getElementById('surprise-me-btn').addEventListener('click', handleSurpriseMe);
    document.getElementById('reset-btn').addEventListener('click', () => {
        // Clear any created object URLs to prevent memory leaks
        Object.values(state).forEach(value => {
            if (value && value.customImage && value.customImage.previewUrl) {
                URL.revokeObjectURL(value.customImage.previewUrl);
            }
        });
        if (state.userImage.previewUrl) URL.revokeObjectURL(state.userImage.previewUrl);
        if(Array.isArray(state.accessories)){
            state.accessories.forEach(acc => {
                if(acc.customImage?.previewUrl) URL.revokeObjectURL(acc.customImage.previewUrl);
            })
        }
        setState(initialState)
    });
    document.getElementById('custom-occasion-prompt').addEventListener('input', e => setState({ customOccasionPrompt: e.target.value }));
    document.getElementById('custom-background-prompt').addEventListener('input', e => setState({ customBackgroundPrompt: e.target.value }));
    
    // Subscribe to state changes to fetch prompts
    subscribe(() => {
        if (state.activeModalImage && state.activeModalImage.isLoadingPrompts) {
            const index = state.generatedImages.findIndex(img => img.src === state.activeModalImage.src);
            if (index !== -1) {
                fetchAndSetShoppingPrompts(index);
            }
        }
    });

    subscribe(renderApp);
    renderApp();
});