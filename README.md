# Blog Dinâmico API — POSTECH Fase 02

API REST para a aplicação de Blog Dinâmico, desenvolvida com Node.js, Express e MongoDB.

## Tecnologias

- **Node.js** — Runtime JavaScript
- **Express** — Framework web
- **MongoDB + Mongoose** — Banco de dados e ODM
- **Docker** — Containerização
- **GitHub Actions** — CI/CD
- **Jest + Supertest** — Testes unitários

## Estrutura do projeto

```
blog-api/
├── src/
│   ├── config/
│   │   └── database.js       # Conexão com MongoDB
│   ├── controllers/
│   │   └── postController.js # Lógica dos endpoints
│   ├── models/
│   │   └── Post.js           # Schema do Post
│   ├── routes/
│   │   └── postRoutes.js     # Definição das rotas
│   ├── tests/
│   │   └── post.test.js      # Testes unitários
│   ├── app.js                # Configuração do Express
│   └── server.js             # Entrada da aplicação
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # Pipeline CI/CD
├── .env.example              # Variáveis de ambiente exemplo
├── Dockerfile                # Imagem Docker
├── docker-compose.yml        # Orquestração dos containers
└── package.json
```

## Setup inicial

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/blog-api.git
cd blog-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` com sua connection string do MongoDB Atlas.

### 4. Rode o projeto
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 5. Com Docker
```bash
docker-compose up -d
```

## Endpoints da API

### Base URL: `http://localhost:3000`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/posts` | Lista todos os posts |
| GET | `/posts/:id` | Busca post por ID |
| GET | `/posts/search?q=termo` | Busca por palavra-chave |
| POST | `/posts` | Cria novo post |
| PUT | `/posts/:id` | Edita post existente |
| DELETE | `/posts/:id` | Exclui post |

### Exemplos de uso

#### Criar post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Minha Aula", "conteudo": "Conteúdo da aula", "autor": "Prof. João"}'
```

#### Listar posts
```bash
curl http://localhost:3000/posts
```

#### Buscar por palavra-chave
```bash
curl http://localhost:3000/posts/search?q=matemática
```

#### Editar post
```bash
curl -X PUT http://localhost:3000/posts/<id> \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Título Atualizado", "conteudo": "Novo conteúdo", "autor": "Prof. João"}'
```

#### Excluir post
```bash
curl -X DELETE http://localhost:3000/posts/<id>
```

## Testes

```bash
# Rodar testes
npm test

# Rodar com cobertura
npm test -- --coverage
```

## CI/CD

O pipeline do GitHub Actions executa automaticamente:
1. Roda os testes a cada push ou pull request na branch `main`
2. Faz o build e push da imagem Docker após testes passarem

### Configurar secrets no GitHub
- `DOCKER_USERNAME` — usuário do Docker Hub
- `DOCKER_PASSWORD` — senha do Docker Hub

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

*[Seção a ser preenchida após o desenvolvimento]*

- Desafios encontrados durante a implementação
- Decisões técnicas tomadas
- Aprendizados do projeto
