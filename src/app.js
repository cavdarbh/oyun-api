const express = require('express');
const logger = require('./middleware/logger');
const oyunRoutes = require('./routes/oyunRoutes');

const app = express();

// 1. Body Parser Middleware (Gelen JSON verisini okumak için)
app.use(express.json());

// 2. Özel Logger Middleware
app.use(logger);

// 3. Oyun Route Bağlama
app.use('/oyunlar', oyunRoutes);

// 4. Tanımsız rotalar için 404 handler
app.use((req, res) => {
  res.status(404).json({
    basarili: false,
    mesaj: "İstenen endpoint bulunamadi."
  });
});

module.exports = app;