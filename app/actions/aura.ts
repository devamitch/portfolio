"use server";

import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API key not configured on server.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateAuraChatAction({
  model,
  contents,
  config,
}: {
  model: string;
  contents: any[];
  config: any;
}) {
  try {
    const ai = getAI();
    const res = await ai.models.generateContent({
      model,
      contents,
      config,
    });
    
    return {
      text: res.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "",
      usageMetadata: res.usageMetadata ? {
        promptTokenCount: res.usageMetadata.promptTokenCount,
        candidatesTokenCount: res.usageMetadata.candidatesTokenCount
      } : null,
    };
  } catch (error: any) {
    console.error("Gemini server error (Chat):", error.message);
    throw new Error(error.message);
  }
}

export async function generateAuraSpeechAction({
  model,
  text,
  voice,
}: {
  model: string;
  text: string;
  voice: string;
}) {
  try {
    const ai = getAI();
    const res = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
        },
      },
    });

    const data = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data) throw new Error("No audio data returned from Gemini");
    
    return { data };
  } catch (error: any) {
    console.error("Gemini server error (Speech):", error.message);
    throw new Error(error.message);
  }
}
