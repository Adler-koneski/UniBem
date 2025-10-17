export function gerarProtocolo(prefix = "UNB") {
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
const base = `${prefix}-${ts}-${rand}`;
// checksum simples
let sum = 0;
for (const ch of base) sum += ch.charCodeAt(0);
const cks = (sum % 97).toString().padStart(2, "0");
return `${base}-${cks}`;
}