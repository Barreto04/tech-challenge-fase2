const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Blog Dinâmico API - POSTECH Fase 02', version: '1.0.0' });
});

app.use('/posts', postRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

module.exports = app;
