const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Reemplaza "TU_API_KEY" con tu clave de OpenAI
const OPENAI_API_KEY = "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";

// Ruta para el webhook
app.post("/webhook", async (req, res) => {
  console.log("Solicitud recibida en /webhook:", req.body); // Log para depuración

  const { from, body } = req.body; // Datos enviados desde el cliente

  try {
    // Llamada a la API de OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Modelo de OpenAI
        messages: [
          { role: "system", content: "Eres un asistente útil y respondes preguntas." },
          { role: "user", content: body } // El contenido enviado en el mensaje
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
    console.log(`Respuesta generada para ${from}: ${reply}`);
    res.json({ reply }); // Enviar respuesta al cliente
  } catch (error) {
    console.error("=== ERROR DETECTADO ===");
    console.error("Mensaje del error:", error.message);

    if (error.response) {
      console.error("Detalles del error de OpenAI:", error.response.data);
      console.error("Estado HTTP:", error.response.status);
    } else {
      console.error("Error general:", error.message);
    }

    res.status(500).send("Hubo un error en el servidor."); // Respuesta en caso de error
  }
});

// Configuración del puerto dinámico de Vercel
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
