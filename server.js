require("dotenv").config();
const express = require("express");
const path = require("path");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/guardar-respuesta", async (req, res) => {
  const opcion = req.body.opcion;

  try {
    await resend.emails.send({
      from: "Formulario <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: "Respuesta del formulario 💘",
      text: `La persona eligió: ${opcion}`,
    });

    res.send("Correo enviado correctamente");
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.send("Error al enviar correo");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});