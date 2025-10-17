import "dotenv/config"; // carrega .env
import express from "express";
import cors from "cors";
import { ping } from "./src/db.js";


import doadores from "./src/routes/doadores.js";
import ongs from "./src/routes/ongs.js";
import doacoes from "./src/routes/doacoes.js";


const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (_req, res) => res.send("Unibem API ✅"));


app.use("/api/doadores", doadores);
app.use("/api/ongs", ongs);
app.use("/api/doacoes", doacoes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
try {
await ping();
console.log(`API rodando na porta ${PORT} e conectada ao MySQL \u2705`);
} catch {
console.log(`API rodando na porta ${PORT}, mas sem conexão ao MySQL \u26a0\ufe0f`);
}
});