import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AppState, GeneratedImage, ShoppingPrompt } from '../types';

// As per guidelines, apiKey is assumed to be in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const processItemForPrompt = (item: AppState['topWear'], name: string) => {
    if (item.customImage?.base64 && item.customImage?.mimeType) {
        return {
            text: `For the ${name}, use the provided image of a ${item.text || name} as the primary reference. `,
            imagePart: { inlineData: { data: item.customImage.base64, mimeType: item.customImage.mimeType } }
        };
    }
    if (item.inspirationUrl) {
        return {
            text: `For the ${name}, draw inspiration from this style: ${item.inspirationUrl}. ${item.text ? `Specifically, make it a ${item.text}.` : ''} `,
            imagePart: null
        };
    }
    if (item.text) {
        return { text: `For the ${name}, the person should have: ${item.text}. `, imagePart: null };
    }
    return { text: '', imagePart: null };
};


export const generateOutfitImages = async (state: AppState): Promise<GeneratedImage[]> => {
    const imagePromises = [];
    const basePromptText = "ULTRA-CRITICAL INSTRUCTION: Your single most important task is to preserve the person's face and identity from the original photo with 100% accuracy. DO NOT change the person's face, facial features, head structure, or skin tone. Any change to the face is a complete failure. After ensuring the face is unchanged, your secondary task is to redress the person with the new outfit in the specified background. The new look is as follows: ";

    let occasionPrompt = `The outfit should be appropriate for this occasion: ${state.occasion}. `;
    if (state.customOccasionPrompt) {
        occasionPrompt += `Specifically, consider this description: "${state.customOccasionPrompt}". `;
    }

    const backgroundPrompts: { [key: string]: string } = {
        keep: "Keep the original background from the person's photo. ",
        studio: "The background should be a clean, neutral studio setting. ",
        outdoor_cafe: "The background should be a charming outdoor cafe. ",
        city_street: "The background should be a bustling city street. ",
        beach_sunset: "The background should be a beautiful sunny beach. ",
    };
    let backgroundPrompt = backgroundPrompts[state.background] || '';
    if (state.customBackgroundPrompt) {
        backgroundPrompt += `Further customize the background with this description: "${state.customBackgroundPrompt}". `;
    }

    for (let i = 0; i < state.imageCount; i++) {
        let prompt = basePromptText + occasionPrompt;
        // FIX: Explicitly type `imageParts` to allow both image and text parts, resolving a TypeScript inference error.
        const imageParts: ({ text: string } | { inlineData: { data: string; mimeType: string; } })[] = [{ inlineData: { data: state.userImage.base64!, mimeType: state.userImage.mimeType! } }];

        const top = processItemForPrompt(state.topWear, 'top wear');
        prompt += top.text; if (top.imagePart) imageParts.push(top.imagePart);

        const bottom = processItemForPrompt(state.bottomWear, 'bottom wear');
        prompt += bottom.text; if (bottom.imagePart) imageParts.push(bottom.imagePart);

        const accessories = processItemForPrompt(state.accessories, 'accessories');
        if (accessories.text) {
             prompt += `The person should also wear the following accessories: ${accessories.text}. `;
             if(accessories.imagePart) imageParts.push(accessories.imagePart);
        }
        
        prompt += backgroundPrompt;
        prompt += `Generate a high-quality, photorealistic image. For this image (variation ${i + 1} of ${state.imageCount}), introduce a creative variation to the outfit to ensure it's distinct from other generated images. For example, you could change the color palette, add a subtle pattern, or slightly alter the style while keeping the core concept. Also, show a unique pose or camera angle (e.g., full body, portrait, walking).`;

        imageParts.push({ text: prompt });

        imagePromises.push(ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: imageParts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        }));
    }

    const imageResults = await Promise.all(imagePromises);
    const generatedImageData = imageResults.flatMap(res =>
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

    if (generatedImageData.length === 0) {
        throw new Error("The model did not return any images. It might have refused the request due to safety policies.");
    }
    return generatedImageData;
};


export const getShoppingPromptsForImage = async (base64: string, mimeType: string): Promise<ShoppingPrompt[]> => {
    const shoppingSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { itemName: { type: Type.STRING }, prompt: { type: Type.STRING } }, required: ["itemName", "prompt"] } };
    const promptParts = [
        { text: "You are an expert at writing e-commerce search queries. Analyze the provided image and for each distinct fashion item (top, bottom, accessories) worn by the person, create a concise and effective search prompt to find similar products online. Your response must be a valid JSON array of objects, conforming to the schema." },
        { inlineData: { data: base64, mimeType } }
    ];
    
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: promptParts },
        config: { responseMimeType: "application/json", responseSchema: shoppingSchema }
    });

    return JSON.parse(result.text);
};


export const getSurpriseOutfit = async (imageBase64: string, imageMimeType: string, occasion: string, customOccasionPrompt: string) => {
    let occasionText = ` for a "${occasion}" occasion`;
    if (customOccasionPrompt) {
        occasionText += `, specifically: "${customOccasionPrompt}"`;
    }
    const prompt = `You are a world-class, creative fashion stylist AI. Your task is to act as a personal stylist for the person in the provided image.
        **Goal:** Generate a NEW, SURPRISING, and STYLISH outfit perfectly suited to them${occasionText}. Avoid generic combinations.
        **Instructions:** 1. Analyze the person in the image. 2. Create a complete outfit: top, bottom, and a few matching accessories. 3. Be creative and ensure the outfit is appropriate for the specified occasion. 4. Provide concise descriptions.
        Your final response MUST be a single, valid JSON object conforming to the schema. Do not include any other text.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            topWear: { type: Type.OBJECT, properties: { description: { type: Type.STRING } }, required: ["description"] },
            bottomWear: { type: Type.OBJECT, properties: { description: { type: Type.STRING } }, required: ["description"] },
            accessories: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING } }, required: ["description"] } }
        },
        required: ["topWear", "bottomWear", "accessories"]
    };

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ inlineData: { data: imageBase64, mimeType: imageMimeType } }, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    return JSON.parse(result.text) as {
        topWear: { description: string };
        bottomWear: { description: string };
        accessories: { description: string }[];
    };
};