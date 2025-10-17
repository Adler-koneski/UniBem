import { Router } from "express";
import { pool } from "../db.js";


const router = Router();


// CREATE
router.post("/", async (req, res) => {
try {
const { nome, email, telefone } = req.body;
if (!nome) return res.status(400).json({ error: "'nome' é obrigatório" });


const [r] = await pool.query(
`INSERT INTO doadores (nome, email, telefone) VALUES (?, ?, ?)`,
[nome, email || null, telefone || null]
);
const [rows] = await pool.query(`SELECT * FROM doadores WHERE id = ?`, [r.insertId]);
res.status(201).json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao inserir doador" });
}
});


// READ (lista)
router.get("/", async (_req, res) => {
try {
const [rows] = await pool.query(`SELECT * FROM doadores ORDER BY created_at DESC`);
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao listar doadores" });
}
});


// READ (um)
router.get("/:id", async (req, res) => {
try {
const [rows] = await pool.query(`SELECT * FROM doadores WHERE id = ?`, [req.params.id]);
if (!rows[0]) return res.status(404).json({ error: "Doador não encontrado" });
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao buscar doador" });
}
});


// UPDATE
router.put("/:id", async (req, res) => {
try {
const { nome, email, telefone } = req.body;
const [r] = await pool.query(
`UPDATE doadores SET nome = COALESCE(?, nome), email = COALESCE(?, email), telefone = COALESCE(?, telefone) WHERE id = ?`,
[nome, email, telefone, req.params.id]
);
if (r.affectedRows === 0) return res.status(404).json({ error: "Doador não encontrado" });
const [rows] = await pool.query(`SELECT * FROM doadores WHERE id = ?`, [req.params.id]);
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao atualizar doador" });
}
});


// DELETE
router.delete("/:id", async (req, res) => {
try {
const [r] = await pool.query(`DELETE FROM doadores WHERE id = ?`, [req.params.id]);
if (r.affectedRows === 0) return res.status(404).json({ error: "Doador não encontrado" });
res.status(204).send();
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao remover doador" });
}
});


export default router;