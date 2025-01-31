const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Tu clave de API de OpenAI desde las variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/webhook", async (req, res) => {
  console.log("Solicitud recibida en /api/webhook:", req.body);

  // Extraer los datos relevantes del JSON recibido
  const messageBody = req.body.message?.body; // El mensaje del cliente
  const contactPhone = req.body.phone; // Número de teléfono del cliente
  const contactName = req.body.first_name; // Nombre del cliente

  if (!messageBody || !contactPhone) {
    return res.status(400).send("Faltan datos necesarios.");
  }

  try {
    // Llamar a la API de OpenAI para generar la respuesta
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil que responde preguntas." },
          { role: "user", content: messageBody }
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

    const reply = response.data.choices[0].message.content; // Respuesta generada por OpenAI

    // Enviar la respuesta a Zapier
    const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/21450137/2f3ey0j/"; // Cambia por tu URL de Zapier
    await axios.post(ZAPIER_WEBHOOK_URL, {
      contact_name: contactName,
      contact_phone: contactPhone,
      response: reply
    });

    console.log("Respuesta enviada correctamente a Zapier.");
    res.status(200).send("Respuesta enviada a Zapier.");
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
    res.status(500).send("Error al procesar la solicitud.");
  }
});

// Configuración del puerto dinámico de Vercel
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
