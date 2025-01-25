const axios = require("axios");

module.exports = async (req, res) => {
  // Verificar que sea un POST
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    // Parsear el cuerpo de la solicitud (necesario en Vercel si no se maneja automáticamente)
    const body = JSON.parse(req.body);

    console.log("Solicitud recibida en /api/webhook:", body); // Log para depuración

    const { from, body: userMessage } = body; // Datos enviados desde el cliente

    // Validar que los campos necesarios existen
    if (!from || !userMessage) {
      res.status(400).send("Solicitud inválida. Faltan datos obligatorios.");
      return;
    }

    // Llamada a la API de OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil y respondes preguntas." },
          { role: "user", content: userMessage },
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
};
