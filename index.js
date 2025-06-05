const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Penting buat baca .env

const app = express();
app.use(express.json());

// Ambil API key dari environment variable
const apiKey = process.env.OPENAI_API_KEY;

app.get("/", (req, res) => {
  res.send("VellBotz AI Server Aktif 🔥");
});

// Endpoint untuk menerima pesan dari client (misal: Game Guardian)
app.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong!" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Gagal koneksi ke OpenAI", detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});
