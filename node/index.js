const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

const config = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'nodedb'
};

app.get('/', async (req, res) => {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    const name = 'William Domingues';

    await connection.execute('INSERT INTO people (name) VALUES (?)', [name]);

    const [rows] = await connection.execute('SELECT name FROM people');

    let html = '<h1>Full Cycle Rocks!</h1>';
    html += '<ul>';

    rows.forEach(row => {
      html += `<li>${row.name}</li>`;
    });

    html += '</ul>';

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao acessar o banco de dados.');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.listen(3000, () => {
  console.log('Node rodando na porta 3000');
});
