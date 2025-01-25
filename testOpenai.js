const axios = require("axios");

const testOpenAI = async () => {
  const OPENAI_API_KEY = "process.env.OPENAI_API_KEY"; // Reemplaza con tu clave
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil y respondes preguntas." },
          { role: "user", content: "Hola, ¿puedes responderme?" },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        }
      }
    );
    console.log("Respuesta:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
};

testOpenAI();
