import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Outfit, ClothingItem, BackgroundOption, SurpriseOutfitResponse, StyleRating, ShoppingPrompt } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSurpriseOutfit = async (userImageBase64: string, userImageMimeType: string): Promise<SurpriseOutfitResponse> => {
    const model = 'gemini-2.5-flash';
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            topWear: { 
                type: Type.OBJECT,
                properties: { description: { type: Type.STRING, description: "A stylish description for the top wear." } },
                required: ["description"]
            },
            bottomWear: {
                type: Type.OBJECT,
                properties: { description: { type: Type.STRING, description: "A stylish description for the bottom wear." } },
                required: ["description"]
            },
            accessories: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { description: { type: Type.STRING, description: "A stylish description for an accessory." } },
                    required: ["description"]
                },
                description: "A list of 2-3 matching accessories."
            }
        },
        required: ["topWear", "bottomWear", "accessories"]
    };
  
    const prompt = `You are a world-class, highly creative fashion stylist AI renowned for your ability to create fresh, unique, and personalized looks. Your task is to act as a personal stylist for the person in the provided image.

**Your Goal:** Generate a NEW, SURPRISING, and STYLISH outfit that is perfectly suited to them. Avoid generic or boring combinations. Think outside the box!

**Instructions:**
1.  **Deeply analyze the person in the image:** Consider their apparent gender, style, and the context of the photo.
2.  **Create a complete outfit:** It must include a top, a bottom, and 2-3 perfectly matching accessories.
3.  **Be creative and diverse:** Suggest a look they might not have considered but would look fantastic in. You could draw inspiration from a wide range of styles like modern minimalist, vibrant streetwear, chic academic, or bohemian free-spirit, but make it cohesive.
4.  **Provide concise descriptions:** For each item, give a short, stylish description.

Your final response MUST be a single, valid JSON object conforming to the provided schema. Do not include any other text or URLs.`;
  
    const imagePart = {
      inlineData: {
        data: userImageBase64,
        mimeType: userImageMimeType,
      },
    };
    const textPart = { text: prompt };
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        },
      });
  
      const parsed = JSON.parse(response.text.trim());
      return parsed as SurpriseOutfitResponse;
    } catch (error) {
      console.error("Error calling Gemini API for surprise outfit:", error);
      throw new Error(`Gemini API request failed for surprise outfit: ${error instanceof Error ? error.message : String(error)}`);
    }
};

const outfitToText = (outfit: Outfit): string => {
    const processItemForText = (item: ClothingItem, name: string): string => {
        if (item.type === 'image' && item.value) return `${name}: Described by a user-provided image ('${item.value}').`;
        if (item.type === 'url' && item.value) return `${name}: Style from URL: ${item.value}`;
        return `${name}: ${item.value}`;
    };

    let description = `The outfit consists of:\n- ${processItemForText(outfit.topWear, 'Top Wear')}\n- ${processItemForText(outfit.bottomWear, 'Bottom Wear')}`;
    if (outfit.accessories && outfit.accessories.length > 0 && (outfit.accessories[0].value || outfit.accessories[0].type === 'image')) {
        description += `\n- Accessories: ${outfit.accessories.map((a, i) => processItemForText(a, `Accessory ${i + 1}`)).join(', ')}`;
    }
    return description;
}

export const rateOutfitStyle = async (outfit: Outfit): Promise<StyleRating> => {
    const model = 'gemini-2.5-flash';
    const schema = {
        type: Type.OBJECT,
        properties: {
            rating: { type: Type.INTEGER, description: "A rating from 1 to 5." },
            title: { type: Type.STRING, description: "A catchy, one-liner title for the critique (e.g., 'Effortlessly Chic', 'Bold & Daring')." },
            critique: { type: Type.STRING, description: "A brief, honest, and constructive critique of the outfit (2-3 sentences)." }
        },
        required: ["rating", "title", "critique"]
    };
    const prompt = `Critique the following fashion outfit based on the provided descriptions. If an item is described by an image, use your fashion knowledge to critique the overall combination as you imagine it. Be an honest but constructive fashion critic.

Instructions:
1.  First, create a short, catchy title for your critique (e.g., "Effortlessly Chic", "A Modern Classic").
2.  Then, provide a rating from 1 to 5 stars (as an integer).
3.  Finally, write a brief, honest critique (2-3 sentences).
    
    Outfit:
    ${outfitToText(outfit)}
    
    Return the response in a single, valid JSON object.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text.trim()) as StyleRating;
};

const processClothingItem = (item: ClothingItem, name: string): { text: string, imagePart: any | null } => {
  let text = '';
  let imagePart = null;

  if (item.type === 'text' && item.value) {
    text = `For the ${name}, the person should have: ${item.value}. `;
  } else if (item.type === 'url' && item.value) {
    text = `For the ${name}, use the style from this URL: ${item.value}. `;
  } else if (item.type === 'image' && item.base64 && item.mimeType) {
    imagePart = { inlineData: { data: item.base64, mimeType: item.mimeType } };
    text = `For the ${name}, use the provided image as a reference. `;
  }
  return { text, imagePart };
};

export const generateShoppingPrompts = async (outfit: Outfit): Promise<ShoppingPrompt[]> => {
    const model = 'gemini-2.5-flash';
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                itemName: { type: Type.STRING, description: "The name of the outfit item (e.g., 'Top Wear', 'Accessory 1')." },
                prompt: { type: Type.STRING, description: "The generated e-commerce search prompt." }
            },
            required: ["itemName", "prompt"]
        }
    };

    let basePromptText = "You are an expert at writing e-commerce search queries. For each of the following outfit items (which may be described with text or an image), create a concise and effective search prompt that a user could paste into a site like Amazon or Google Shopping to find similar products. Use descriptive keywords. Your response must be a valid JSON array of objects, conforming to the schema.\n\nOutfit details:\n";
    const parts: any[] = [];

    const processItemForPrompt = (item: ClothingItem, name: string) => {
        const { text, imagePart } = processClothingItem(item, name);
        basePromptText += `- ${text}\n`;
        if (imagePart) {
            parts.push(imagePart);
        }
    };

    processItemForPrompt(outfit.topWear, 'Top Wear');
    processItemForPrompt(outfit.bottomWear, 'Bottom Wear');
    if (outfit.accessories.length > 0 && (outfit.accessories[0].value || outfit.accessories[0].type === 'image')) {
        outfit.accessories.forEach((acc, i) => {
            processItemForPrompt(acc, `Accessory ${i + 1}`);
        });
    }

    parts.unshift({ text: basePromptText });

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts },
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        return JSON.parse(response.text.trim()) as ShoppingPrompt[];
    } catch (error) {
        console.error("Error generating shopping prompts:", error);
        return []; // Return empty array on failure
    }
};

export const generateStyledImages = async (
  userImageBase64: string,
  userImageMimeType: string,
  outfit: Outfit,
  background: BackgroundOption,
  customBackgroundPrompt: string,
  imageCount: number
): Promise<string[]> => {
  const model = 'gemini-2.5-flash-image-preview';

  let basePromptText = "ULTRA-CRITICAL INSTRUCTION: Your single most important task is to preserve the person's face and identity from the original photo with 100% accuracy. DO NOT change the person's face, facial features, head structure, or skin tone in any way. Any change to the face is a complete failure and is not allowed. After ensuring the face is unchanged, your secondary task is to redress the person with the new outfit in the specified background. ";
  
  basePromptText += "The new look is as follows: ";

  const imageParts: any[] = [
    { inlineData: { data: userImageBase64, mimeType: userImageMimeType } }
  ];

  const topWearResult = processClothingItem(outfit.topWear, 'top wear');
  basePromptText += topWearResult.text;
  if (topWearResult.imagePart) imageParts.push(topWearResult.imagePart);

  const bottomWearResult = processClothingItem(outfit.bottomWear, 'bottom wear');
  basePromptText += bottomWearResult.text;
  if (bottomWearResult.imagePart) imageParts.push(bottomWearResult.imagePart);

  if (outfit.accessories.length > 0 && (outfit.accessories[0].value || outfit.accessories[0].type === 'image')) {
    let accessoryPrompt = 'The person should also wear the following accessories: ';
    outfit.accessories.forEach((acc, index) => {
      const accResult = processClothingItem(acc, `accessory ${index + 1}`);
      accessoryPrompt += accResult.text;
      if (accResult.imagePart) imageParts.push(accResult.imagePart);
    });
    basePromptText += accessoryPrompt;
  }

  let backgroundPromptText = '';
  switch (background) {
    case 'keep':
      backgroundPromptText = "Keep the original background from the person's photo. ";
      break;
    case 'studio':
      backgroundPromptText = "The background should be a clean, neutral studio setting. ";
      break;
    case 'outdoor_cafe':
        backgroundPromptText = "The background should be a charming outdoor cafe. ";
        break;
    case 'city_street':
        backgroundPromptText = "The background should be a bustling city street. ";
        break;
    case 'beach_sunset':
        backgroundPromptText = "The background should be a beautiful sunny beach. ";
        break;
  }
  
  if (customBackgroundPrompt) {
      backgroundPromptText += `Further customize the background with this description: "${customBackgroundPrompt}". `;
  }
  basePromptText += backgroundPromptText;


  basePromptText += `Generate a high-quality, photorealistic image showing the person in this complete outfit. Ensure the person's face and features are preserved accurately as per the critical instruction.`;

  const generationPromises = Array.from({ length: imageCount }, (_, i) => {
      const uniquePrompt = `${basePromptText} For this image, show a unique pose or camera angle (e.g., full body, portrait, walking). This is variation ${i + 1} of ${imageCount}.`;
      const finalParts = [...imageParts, { text: uniquePrompt }];
      
      return ai.models.generateContent({
        model: model,
        contents: { parts: finalParts },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
      }).then(response => {
          if (response.candidates && response.candidates.length > 0) {
              for (const part of response.candidates[0].content.parts) {
                  if (part.inlineData) {
                      const base64ImageBytes: string = part.inlineData.data;
                      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                  }
              }
          }
          return null;
      });
  });
  
  try {
    const results = await Promise.all(generationPromises);
    const validImages = results.filter((img): img is string => img !== null);
    
    if (validImages.length === 0) {
        throw new Error("The model did not return any images. It might have refused the request due to safety policies.");
    }
    
    return validImages;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Gemini API request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};