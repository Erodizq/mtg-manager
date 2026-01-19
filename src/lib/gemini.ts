import { GoogleGenerativeAI } from "@google/generative-ai";

// Clave API: Debe venir de variable de entorno
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn("⚠️ Falta la clave de API de Gemini (NEXT_PUBLIC_GEMINI_API_KEY)");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function identifyCardWithGemini(imageBase64: string): Promise<string> {
  try {
    // Using Gemini 2.0 Flash as confirmed by API capabilities list
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Limpiar el prefijo de data URL si existe
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
    Identifica la carta de Magic the Gathering en esta imagen.
    Devuelve SOLAMENTE un objeto JSON válido con estos campos:
    {
      "name": "Nombre en inglés de la carta",
      "set_code": "Código de 3 letras de la expansión si es visible (ej. MID, NEO)",
      "collector_number": "Número de coleccionista si es visible"
    }
    Si no hay carta visible, devuelve { "error": "NO CARD" }.
    NO uses markdown (\`\`\`json). Solo el JSON puro.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return text;
  } catch (error: any) {
    console.error("Gemini Vision Error:", error);
    throw new Error(error.message || "No se pudo identificar la carta con Gemini.");
  }
}
