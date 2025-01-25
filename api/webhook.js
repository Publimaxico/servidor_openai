const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  console.log("Solicitud recibida en /api/webhook:", req.body);

  const { from, body } = req.body; // Datos enviados desde el cliente

  try {
    // Llamada a la API de OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil y respondes preguntas." },
          { role: "user", content: body }
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

    // Respuesta estructurada para GoHighLevel
    res.json({ reply }); // Envía sólo la respuesta generada
  } catch (error) {
    console.error("=== ERROR DETECTADO ===");
    console.error(error.message);

    if (error.response) {
      console.error("Detalles del error de OpenAI:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error("Error general:", error.message);
      res.status(500).json({ error: "Hubo un error en el servidor." });
    }
  }
};
