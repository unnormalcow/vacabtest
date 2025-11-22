import { GoogleGenAI, Type } from "@google/genai";
import { WordItem, GradeLevel } from "../types";

const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return apiKey;
};

export const generateAvatar = async (description: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Using gemini-2.5-flash-image for generation (nano banana)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a cute, vibrant, flat-design vector cartoon avatar icon based on this description: "${description}". The background should be a simple solid soft color. Focus on the face.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Error generating avatar:", error);
    // Return a default placeholder if generation fails
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=" + Math.random(); 
  }
};

const GRADE_MAP: Record<GradeLevel, string> = {
  'grade7': 'Grade 7 (Junior 1)',
  'grade8': 'Grade 8 (Junior 2)',
  'grade9': 'Grade 9 (Junior 3)',
  'grade10': 'Grade 10 (Senior 1)',
  'grade11': 'Grade 11 (Senior 2)',
  'grade12': 'Grade 12 (Senior 3)',
};

export const generateVocabulary = async (topic: string, grade: GradeLevel, count: number): Promise<WordItem[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const gradeText = GRADE_MAP[grade];
    const textbook = "People's Education Press 'Jingtong' Edition (人教精通版)";

    const prompt = `
      Generate a list of exactly ${count} English vocabulary words suitable for students in ${gradeText} following the ${textbook} curriculum.
      Focus on the topic: "${topic}".
      
      For each word, provide:
      1. The English word (lowercase).
      2. The Chinese meaning (concise).
      3. A simple example sentence in English where the word is used, suitable for the grade level.
      
      Ensure the words are strictly aligned with the ${textbook} vocabulary syllabus for ${gradeText}.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "The vocabulary word in lowercase" },
              meaning: { type: Type.STRING, description: "Chinese definition" },
              sentence: { type: Type.STRING, description: "Example sentence using the word" }
            },
            required: ["word", "meaning", "sentence"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text) as WordItem[];
    // Ensure we respect the count even if model generates more/less
    return data.slice(0, count);
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw error;
  }
};