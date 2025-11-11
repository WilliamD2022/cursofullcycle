Desafio Full Cycle - Nginx + Node.js + MySQL

Projeto desenvolvido para o desafio do curso Full Cycle, utilizando o Nginx como proxy reverso para uma aplicação Node.js que se conecta a um banco MySQL em containers Docker.

O objetivo é:

Receber a requisição no Nginx (localhost:8080);

Encaminhar para o serviço Node.js;

O Node.js se conecta ao MySQL, garante a tabela people, insere um registro e exibe os dados cadastrados.

🚀 Tecnologias Utilizadas

Docker & Docker Compose

Nginx (alpine) como Reverse Proxy

Node.js 18 (alpine) + Express

MySQL 8.0

Rede Docker interna (bridge)

🧱 Arquitetura

nginx

Recebe as requisições HTTP na porta 8080 (externa) → 80 (container).

Encaminha para o Node.js via upstream:

upstream node_app {
    server fc-node:3000;
}


fc-node (Node.js)

Roda na porta 3000 dentro do container.

Conecta no banco MySQL usando as configs:

Host: db

User: root

Password: root

Database: nodedb

Ao acessar /:

Garante a existência da tabela people;

Insere um registro;

Retorna um HTML listando os registros da tabela.

fc-mysql (MySQL)

Inicializado com script mysql/init.sql:

CREATE DATABASE IF NOT EXISTS nodedb;
USE nodedb;

CREATE TABLE IF NOT EXISTS people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

📂 Estrutura de Pastas
cursofullcycle/
├── docker-compose.yml
├── nginx/
│   ├── Dockerfile
│   └── default.conf
├── node/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
└── mysql/
    └── init.sql

▶️ Como Executar o Projeto
1. Pré-requisitos

Docker instalado

Docker Compose instalado

2. Clonar o repositório
git clone https://github.com/SEU_USUARIO/cursofullcycle.git
cd cursofullcycle

3. Subir os containers
docker-compose up -d --build


Isso irá:

Criar a rede fc-network;

Subir o MySQL (fc-mysql);

Subir o Node.js (fc-node);

Subir o Nginx (fc-nginx), expondo a porta 8080.

✅ Testando a Aplicação

Acesse no navegador:

http://localhost:8080


O fluxo será:

Nginx recebe a requisição;

Redireciona para fc-node:3000;

Node.js conecta ao MySQL (db);

Garante tabela people;

Insere um registro;

Renderiza uma página HTML listando os registros da tabela.

Se você visualizar a listagem de nomes retornada pela aplicação, o desafio está concluído com sucesso. ✅

🛑 Parar os Containers

Para desligar tudo e liberar recursos:

docker-compose down


Se quiser remover também o volume do MySQL:

docker-compose down -v

📝 Boas Práticas Aplicadas

Uso de variáveis padrão no Node.js para host/usuário/senha/banco.

Separação clara por responsabilidade:

nginx (proxy)

node (aplicação)

mysql (banco)

Uso de rede Docker dedicada para comunicação interna.

Script SQL versionado em mysql/init.sql para garantir idempotência na criação de banco/tabela.

Imagens alpine para containers mais leves.
