const express = require('express');
const router = express.Router();
const { kullanicilariOku, kullanicilariKaydet } = require('../utils/dosya');

// GET /kullanicilar - Tüm kullanıcılar
router.get('/', (req, res) => {
  const kullanicilar = kullanicilariOku();
  res.status(200).json({ basarili: true, toplam: kullanicilar.length, veri: kullanicilar });
});

// GET /kullanicilar/:id - Tekil kullanıcı
router.get('/:id', (req, res) => {
  const kullanicilar = kullanicilariOku();
  const kullanici = kullanicilar.find(k => k.id === parseInt(req.params.id));

  if (!kullanici) {
    return res.status(404).json({ basarili: false, mesaj: "Kullanıcı bulunamadı." });
  }

  res.status(200).json({ basarili: true, veri: kullanici });
});

// POST /kullanicilar - Yeni kullanıcı ekle
router.post('/', (req, res) => {
  const { kullaniciAdi, eposta } = req.body;

  if (!kullaniciAdi || !eposta) {
    return res.status(400).json({ basarili: false, mesaj: "kullaniciAdi ve eposta zorunludur." });
  }

  const kullanicilar = kullanicilariOku();
  const yeniKullanici = {
    id: kullanicilar.length > 0 ? kullanicilar[kullanicilar.length - 1].id + 1 : 1,
    kullaniciAdi,
    eposta
  };

  kullanicilar.push(yeniKullanici);
  kullanicilariKaydet(kullanicilar);

  res.status(201).json({ basarili: true, veri: yeniKullanici });
});

// DELETE /kullanicilar/:id - Kullanıcı sil
router.delete('/:id', (req, res) => {
  const kullanicilar = kullanicilariOku();
  const index = kullanicilar.findIndex(k => k.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ basarili: false, mesaj: "Kullanıcı bulunamadı." });
  }

  const silinen = kullanicilar.splice(index, 1);
  kullanicilariKaydet(kullanicilar);

  res.status(200).json({ basarili: true, mesaj: "Kullanıcı silindi.", veri: silinen[0] });
});

module.exports = router;