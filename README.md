# Blog Dinâmico — POSTECH Full-Stack Development

Aplicação de Blog Dinâmico desenvolvida ao longo do curso, com API REST (Fase 02) e frontend em React (Fase 03).

## Link do repositório

https://github.com/Barreto04/tech-challenge-fase2

## Tecnologias

**Backend**
- **Node.js + Express** — API REST
- **MongoDB + Mongoose** — Banco de dados e ODM
- **Jest + Supertest** — Testes unitários

**Frontend**
- **React** — Interface de usuário
- **Tailwind CSS** — Estilização
- **React Router** — Navegação
- **Context API** — Gerenciamento de estado (autenticação)
- **Axios** — Requisições HTTP
- **Nginx** — Servidor de arquivos estáticos em produção

**Infraestrutura**
- **Docker + Docker Compose** — Containerização
- **GitHub Actions** — CI/CD

## Estrutura do projeto

tech-challenge-fase2/
├── src/ # API Node.js (Fase 02)
│ ├── config/
│ │ └── database.js # Conexão com MongoDB
│ ├── controllers/
│ │ └── postController.js # Lógica dos endpoints
│ ├── models/
│ │ └── Post.js # Schema do Post
│ ├── routes/
│ │ └── postRoutes.js # Definição das rotas
│ ├── tests/
│ │ └── post.test.js # Testes unitários
│ ├── app.js # Configuração do Express
│ └── server.js # Entrada da aplicação
├── frontend/ # Frontend React (Fase 03)
│ ├── src/
│ │ ├── App.js
│ │ ├── components/ # Navbar, PostCard, PrivateRoute
│ │ ├── context/ # AuthContext
│ │ ├── pages/ # Home, PostDetail, PostForm, Admin, Login
│ │ └── services/ # api.js (Axios)
│ ├── Dockerfile
│ └── nginx.conf
├── .github/
│ └── workflows/
│ └── ci-cd.yml # Pipeline CI/CD (API + frontend)
├── .env.example # Variáveis de ambiente exemplo (API)
├── Dockerfile # Imagem Docker da API
├── docker-compose.yml # Orquestração: API + frontend + MongoDB
└── package.json


## Setup inicial

### 1. Clone o repositório
```bash
git clone https://github.com/Barreto04/tech-challenge-fase2.git
cd tech-challenge-fase2
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o `.env` com a connection string do MongoDB, e `frontend/.env` com a URL da API (`REACT_APP_API_URL`).

### 3. Suba tudo com Docker Compose
```bash
docker compose up -d --build
```

Isso sobe três containers:
- **API** — `http://localhost:3001`
- **Frontend** — `http://localhost:3000`
- **MongoDB** — `localhost:27017`

### Rodando sem Docker (desenvolvimento)

**API:**
```bash
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Login do frontend

- **Usuário:** `professor`
- **Senha:** `postech2026`

## Endpoints da API

### Base URL: `http://localhost:3001`

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Autenticação (retorna token) |
| GET | `/posts` | Lista todos os posts |
| GET | `/posts/:id` | Busca post por ID |
| GET | `/posts/search?q=termo` | Busca por palavra-chave |
| POST | `/posts` | Cria novo post |
| PUT | `/posts/:id` | Edita post existente |
| DELETE | `/posts/:id` | Exclui post |

### Exemplos de uso

#### Criar post
```bash
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Minha Aula", "conteudo": "Conteúdo da aula", "autor": "Prof. João"}'
```

#### Listar posts
```bash
curl http://localhost:3001/posts
```

#### Buscar por palavra-chave
```bash
curl http://localhost:3001/posts/search?q=matemática
```

#### Editar post
```bash
curl -X PUT http://localhost:3001/posts/<id> \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Título Atualizado", "conteudo": "Novo conteúdo", "autor": "Prof. João"}'
```

#### Excluir post
```bash
curl -X DELETE http://localhost:3001/posts/<id>
```

## Testes

**API:**
```bash
npm test
npm test -- --coverage
```

**Frontend:**
```bash
cd frontend
CI=true npm test
```

## CI/CD

O pipeline do GitHub Actions (`.github/workflows/ci-cd.yml`) executa automaticamente a cada push ou pull request na branch `main`:

1. Roda os testes da API e do frontend em paralelo
2. Após os testes passarem, builda e envia as imagens Docker (API e frontend) para o Docker Hub

### Configurar secrets no GitHub
- `DOCKER_USERNAME` — usuário do Docker Hub
- `DOCKER_PASSWORD` — senha do Docker Hub
- `REACT_APP_API_URL` — URL pública da API, usada no build do frontend

## Modelo de dados — Post

```json
{
  "_id": "ObjectId",
  "titulo": "string (obrigatório, max 150 chars)",
  "conteudo": "string (obrigatório)",
  "autor": "string (obrigatório)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

## Experiências e desafios

Durante a integração do frontend com a API na Fase 03, os principais desafios encontrados foram:

- **Módulo ausente causando loop de restart:** o container da API entrou em loop de reinicialização porque o `src/app.js` (que exporta a instância do Express usada pelo `server.js`) não estava presente na pasta de trabalho. O arquivo foi recuperado do histórico do Git e o problema foi resolvido após rebuildar a imagem.
- **Conflito de portas no Docker Desktop + WSL2:** ao mapear a API para a porta 3000, ela entrou em conflito com o servidor de desenvolvimento do React (`npm start`), que também tenta usar a porta 3000 — o Docker "vencia" o processo do WSL, fazendo o navegador exibir a resposta da API em vez do frontend. A solução foi manter a separação de portas original (API em 3001, frontend em 3000).
- **Variáveis de ambiente do React em tempo de build:** diferente de aplicações Node.js, o Create React App "queima" variáveis `REACT_APP_*` no momento do `npm run build`, não em runtime. Por isso, `REACT_APP_API_URL` precisou ser passada como `ARG` no Dockerfile do frontend e como `build.args` no `docker-compose.yml`, em vez de como variável de ambiente comum do container.
- **Teste padrão do Create React App:** o teste inicial gerado automaticamente (`App.test.js`) procurava pelo texto placeholder "learn react", que não existe mais na aplicação customizada. Foi substituído por um teste que valida o carregamento real da página inicial do Blog Dinâmico, permitindo que o pipeline de CI/CD passasse corretamente.