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

async function waitForDB(retries = 20, delayMs = 2000) {
  while (retries > 0) {
    try {
      const conn = await mysql.createConnection(dbConfig);
      await conn.execute('SELECT 1');
      await conn.end();
      console.log('✅ MySQL disponível!');
      return;
    } catch (err) {
      console.log(`⏳ Aguardando MySQL... (${retries} tentativas restantes)`);
      await new Promise(r => setTimeout(r, delayMs));
      retries--;
    }
  }
  throw new Error('MySQL não ficou disponível a tempo');
}

app.get('/', (_req, res) => {
  res.send('FullCycle App rodando com dependência entre containers! 🚀');
});

waitForDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🔥 App ouvindo na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar app:', err.message);
    process.exit(1);
  });
