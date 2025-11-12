import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'fullcycle'
};

async function getConnection() { return mysql.createConnection(dbConfig); }

async function ensureSchema() {
  const conn = await getConnection();
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `);
  await conn.end();
}

function randomName() {
  const names = ['William', 'Alciane', 'Kiara', 'Nymeria', 'Full', 'Cycle', 'Rocks'];
  return names[Math.floor(Math.random() * names.length)];
}

app.get('/', async (_req, res) => {
  try {
    await ensureSchema();
    const conn = await getConnection();

    const name = randomName();
    await conn.execute('INSERT INTO people (name) VALUES (?)', [name]);

    const [rows] = await conn.execute('SELECT name FROM people ORDER BY id DESC');
    await conn.end();

    const list = rows.map(r => `<li>${r.name}</li>`).join('');
    const html = `<h1>Full Cycle Rocks!</h1><ul>${list}</ul>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    console.error('Erro no handler /:', err);
    res.status(500).send('<h1>Erro interno no servidor</h1>');
  }
});

app.listen(port, () => console.log(`🔥 App ouvindo na porta ${port}`));
