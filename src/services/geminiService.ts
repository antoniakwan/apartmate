import { GoogleGenAI } from "@google/genai";
import { Friend } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getFriendMessage(friend: Friend, apartmentContext: string, userMessage: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are ${friend.name}, a ${friend.species} living in a cozy apartment. 
      Your personality is: ${friend.personality}.
      The apartment currently has: ${apartmentContext}.
      
      User says: "${userMessage}"
      
      Respond in character, keep it short and cute (max 2 sentences).`,
    });
    return response.text || "I'm just enjoying the view!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oh, I'm a bit lost in thought right now...";
  }
}

export async function generateApartmentStory(friends: Friend[], furnitureNames: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a very short, cozy 3-sentence story about an apartment shared by ${friends.map(f => f.name).join(', ')}. 
      Mention some of the furniture: ${furnitureNames.join(', ')}. 
      Make it feel like a warm hug.`,
    });
    return response.text || "It's a quiet day in the apartment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The apartment is peaceful today.";
  }
}
