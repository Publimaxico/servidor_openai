const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Reemplaza "TU_API_KEY" con tu clave de OpenAI
const OPENAI_API_KEY = "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";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message; // Mensaje recibido del cliente

  try {
    // Llamada a la API de OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Cambia a "gpt-3.5-turbo" si prefieres
        messages: [
          { role: "system", content: "Eres un asistente útil y respondes preguntas." },
          { role: "user", content: userMessage }
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

    // Respuesta generada por OpenAI
    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("=== ERROR DETECTADO ===");
    console.error("Mensaje:", error.message);

    if (error.response) {
      console.error("Datos de respuesta de OpenAI:", error.response.data);
      console.error("Estado HTTP:", error.response.status);
    } else {
      console.error("No hubo respuesta de OpenAI. Error general:", error.message);
    }

    res.status(500).send("Hubo un error en el servidor.");
  }
});

app.listen(4000, () => console.log("Servidor corriendo en el puerto 4000"));
