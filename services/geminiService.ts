import { GoogleGenAI } from "@google/genai";
import { UserProfile } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSwimFeedback = async (
  sessionNotes: string,
  userProfile: UserProfile
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Não foi possível conectar ao treinador IA (API Key ausente).";

  const prompt = `
    Você é um treinador de natação experiente, motivador e com senso de humor.
    O usuário se chama ${userProfile.name}, é do sexo ${userProfile.gender}.
    O nível atual (título engraçado) del@ é "${userProfile.levelTitle}".
    
    O usuário acabou de nadar e relatou o seguinte: "${sessionNotes}".
    
    Por favor:
    1. Dê um feedback curto (máximo 3 frases).
    2. Se o relato for negativo (cansou, bebeu água), seja empático mas faça uma piada leve com o nível atual del@.
    3. Dê uma dica técnica simples focada em "Mindfulness" ou "Cabeça Conectada" na água baseada no relato.
    4. Termine com uma frase encorajadora.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Continue nadando! (A IA ficou sem palavras)";
  } catch (error) {
    console.error("Erro ao gerar feedback:", error);
    return "Bom treino! Continue focado na respiração.";
  }
};

export const generateWeeklyChallenge = async (levelTitle: string): Promise<string> => {
   const ai = getAiClient();
   if (!ai) return "Desafio: Nade 200m livre.";

   const prompt = `
     Crie um mini-desafio de natação divertido para alguém que está no nível "${levelTitle}".
     O desafio deve ser focado em técnica ou respiração, não apenas distância.
     Máximo 15 palavras.
   `;

   try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: prompt,
     });
     return response.text?.trim() || "Foque em soltar todo o ar pelo nariz.";
   } catch (error) {
     return "Foque na técnica de pernada hoje.";
   }
}