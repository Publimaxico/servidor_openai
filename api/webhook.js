const express = require("express");
const axios = require("axios");

const app = express();

// Middleware para procesar el cuerpo de las solicitudes como JSON
app.use(express.json());

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  console.log("Solicitud recibida en /api/webhook:", req.body);

  const { from, body } = req.body; // Aquí ocurre el problema si req.body es undefined

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil y respondes preguntas." },
          { role: "user", content: body },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log(`Respuesta generada para ${from}: ${reply}`);
    res.json({ reply });
  } catch (error) {
    console.error("=== ERROR DETECTADO ===");
    console.error("Mensaje del error:", error.message);

    if (error.response) {
      console.error("Detalles del error de OpenAI:", error.response.data);
      console.error("Estado HTTP:", error.response.status);
    } else {
      console.error("Error general:", error.message);
    }

    res.status(500).send("Hubo un error en el servidor.");
  }
};