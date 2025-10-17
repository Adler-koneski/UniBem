import { Router } from "express";
import { pool } from "../db.js";


const router = Router();


router.post("/", async (req, res) => {
try {
const { nome, cnpj, cidade } = req.body;
if (!nome) return res.status(400).json({ error: "'nome' é obrigatório" });
const [r] = await pool.query(
`INSERT INTO ongs (nome, cnpj, cidade) VALUES (?, ?, ?)`,
[nome, cnpj || null, cidade || null]
);
const [rows] = await pool.query(`SELECT * FROM ongs WHERE id = ?`, [r.insertId]);
res.status(201).json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao inserir ONG" });
}
});


router.get("/", async (_req, res) => {
try {
const [rows] = await pool.query(`SELECT * FROM ongs ORDER BY created_at DESC`);
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao listar ONGs" });
}
});


router.get("/:id", async (req, res) => {
try {
const [rows] = await pool.query(`SELECT * FROM ongs WHERE id = ?`, [req.params.id]);
if (!rows[0]) return res.status(404).json({ error: "ONG não encontrada" });
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao buscar ONG" });
}
});


router.put("/:id", async (req, res) => {
try {
const { nome, cnpj, cidade } = req.body;
const [r] = await pool.query(
`UPDATE ongs SET nome = COALESCE(?, nome), cnpj = COALESCE(?, cnpj), cidade = COALESCE(?, cidade) WHERE id = ?`,
[nome, cnpj, cidade, req.params.id]
);
if (r.affectedRows === 0) return res.status(404).json({ error: "ONG não encontrada" });
const [rows] = await pool.query(`SELECT * FROM ongs WHERE id = ?`, [req.params.id]);
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao atualizar ONG" });
}
});


router.delete("/:id", async (req, res) => {
try {
const [r] = await pool.query(`DELETE FROM ongs WHERE id = ?`, [req.params.id]);
if (r.affectedRows === 0) return res.status(404).json({ error: "ONG não encontrada" });
res.status(204).send();
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao remover ONG" });
}
});


export default router;