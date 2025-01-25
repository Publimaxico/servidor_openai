const axios = require("axios");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    const { from, body } = req.body;

    if (!from || !body) {
      return res.status(400).send("Faltan datos en la solicitud.");
    }

    // Llamada a OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres un asistente útil." },
          { role: "user", content: body }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error en el servidor:", error.message);
    if (error.response) {
      console.error("Detalles:", error.response.data);
    }
    return res.status(500).send("Hubo un error en el servidor.");
  }
};
