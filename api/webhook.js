const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Usar la clave de API de OpenAI desde variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Ruta para el webhook
app.post("/api/webhook", async (req, res) => {
  console.log("Solicitud recibida en /api/webhook:", req.body);

  // Extraer el cuerpo del mensaje
  const messageBody = req.body.message?.body; // Usar optional chaining

  if (!messageBody) {
    console.error("Mensaje vacío o no válido.");
    return res.status(400).send("Mensaje vacío o no válido.");
  }

  try {
    // Llamar a la API de OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil y respondes preguntas." },
          { role: "user", content: messageBody } // Pasar el mensaje del usuario
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Respuesta generada por OpenAI
    const reply = response.data.choices[0].message.content;
    console.log(`Respuesta generada: ${reply}`);

    // Responder directamente a GHL en el formato esperado
    res.json({
      fulfillmentMessages: [
        {
          text: {
            text: [reply] // Incluir la respuesta generada
          }
        }
      ]
    });
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
});

// Configuración del puerto dinámico de Vercel
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
