import dotenv from "dotenv";
import express from "express";
import path from "path";
import { Resend } from "resend";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/guardar-respuesta", async (req, res) => {
  const opcion = req.body.opcion;

  if (!opcion) {
    return res.status(400).json({ ok: false, error: "No se recibió ninguna opción" });
  }

  try {
    await resend.emails.send({
      from: "Formulario <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: "Respuesta del formulario 💘",
      html: `<h2>Alguien eligió:</h2><p style="font-size:22px">${opcion}</p>`
    });

    res.json({ ok: true, mensaje: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ ok: false, error: "Error al enviar correo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
