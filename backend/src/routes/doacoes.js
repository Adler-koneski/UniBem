import { Router } from "express";
import { pool } from "../db.js";
import { gerarProtocolo } from "../services/protocolo.js";


const router = Router();


// CREATE doação
router.post("/", async (req, res) => {
try {
const { doador_id, ong_id, valor } = req.body;
if (!doador_id || !ong_id || !valor) {
return res.status(400).json({ error: "'doador_id', 'ong_id' e 'valor' são obrigatórios" });
}


// valida FK básicas
const [[doador]] = await pool.query(`SELECT id FROM doadores WHERE id = ?`, [doador_id]);
const [[ong]] = await pool.query(`SELECT id FROM ongs WHERE id = ?`, [ong_id]);
if (!doador) return res.status(400).json({ error: "Doador inválido" });
if (!ong) return res.status(400).json({ error: "ONG inválida" });


const protocolo = gerarProtocolo("UNB");
const [r] = await pool.query(
`INSERT INTO doacoes (doador_id, ong_id, valor, protocolo) VALUES (?, ?, ?, ?)`,
[doador_id, ong_id, valor, protocolo]
);
const [rows] = await pool.query(`SELECT * FROM doacoes WHERE id = ?`, [r.insertId]);
res.status(201).json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao registrar doação" });
}
});


// LISTAR doações (com JOIN)
router.get("/", async (_req, res) => {
try {
const [rows] = await pool.query(`
SELECT d.id, d.valor, d.protocolo, d.created_at,
dr.nome AS doador, og.nome AS ong
FROM doacoes d
JOIN doadores dr ON dr.id = d.doador_id
JOIN ongs og ON og.id = d.ong_id
ORDER BY d.created_at DESC
`);
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao listar doações" });
}
});


// BUSCAR por protocolo
router.get("/protocolo/:codigo", async (req, res) => {
try {
const [rows] = await pool.query(
`SELECT * FROM doacoes WHERE protocolo = ?`,
[req.params.codigo]
);
if (!rows[0]) return res.status(404).json({ error: "Protocolo não encontrado" });
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao buscar protocolo" });
}
});


export default router;