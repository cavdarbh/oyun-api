const express = require('express');
const logger = require('./middleware/logger');
const oyunRoutes = require('./routes/oyunRoutes');
const kullaniciRoutes = require('./routes/kullaniciRoutes');

const app = express();

// Body Parser Middleware (Gelen JSON verisini okumak için)
app.use(express.json());

// Özel Logger Middleware
app.use(logger);

// Oyun ve User Route Bağlama
app.use('/oyunlar', oyunRoutes);
app.use('/kullanicilar', kullaniciRoutes);

// 4. Tanımsız rotalar için 404 handler
app.use((req, res) => {
  res.status(404).json({
    basarili: false,
    mesaj: "İstenen endpoint bulunamadi."
  });
});

module.exports = app;