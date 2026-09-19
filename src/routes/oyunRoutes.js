const express = require('express');
const router = express.Router();
const { oyunlariOku, oyunlariKaydet } = require('../utils/dosya');
const oyunDogrula = require('../middleware/dogrula');

// 1. GET /oyunlar - Tüm oyunları listele veya arama yap (Query filtering)
router.get('/', (req, res) => {
  let oyunlar = oyunlariOku();
  const { ara, tur } = req.query;

  // İsimle arama: /oyunlar?ara=witcher
  if (ara) {
    oyunlar = oyunlar.filter(o => 
      o.ad.toLowerCase().includes(ara.toLowerCase())
    );
  }

  // Türe göre filtreleme: /oyunlar?tur=RPG
  if (tur) {
    oyunlar = oyunlar.filter(o => 
      o.tur.toLowerCase() === tur.toLowerCase()
    );
  }

  res.status(200).json({
    basarili: true,
    toplam: oyunlar.length,
    veri: oyunlar
  });
});

// 2. GET /oyunlar/:id - Tek bir oyunu getir
router.get('/:id', (req, res) => {
  const oyunlar = oyunlariOku();
  const oyun = oyunlar.find(o => o.id === parseInt(req.params.id));

  if (!oyun) {
    return res.status(404).json({
      basarili: false,
      mesaj: "Oyun bulunamadı."
    });
  }

  res.status(200).json({
    basarili: true,
    veri: oyun
  });
});

// 3. POST /oyunlar - Yeni oyun ekle (Giriş doğrulamalı)
router.post('/', oyunDogrula, (req, res) => {
  const { ad, tur, fiyat, puan } = req.body;
  const oyunlar = oyunlariOku();

  // Otomatik ID üretimi
  const yeniId = oyunlar.length > 0 ? oyunlar[oyunlar.length - 1].id + 1 : 1;

  const yeniOyun = {
    id: yeniId,
    ad,
    tur,
    fiyat: fiyat !== undefined ? Number(fiyat) : 0,
    puan: puan !== undefined ? Number(puan) : null
  };

  oyunlar.push(yeniOyun);
  oyunlariKaydet(oyunlar);

  res.status(201).json({
    basarili: true,
    mesaj: "Oyun başarıyla eklendi.",
    veri: yeniOyun
  });
});

// 4. PUT /oyunlar/:id - Var olan oyunu güncelle
router.put('/:id', oyunDogrula, (req, res) => {
  const oyunlar = oyunlariOku();
  const index = oyunlar.findIndex(o => o.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      basarili: false,
      mesaj: "Güncellenecek oyun bulunamadı."
    });
  }

  const { ad, tur, fiyat, puan } = req.body;

  // Mevcut veriyi koruyup yeni gelenlerle güncelle
  oyunlar[index] = {
    ...oyunlar[index],
    ad,
    tur,
    fiyat: fiyat !== undefined ? Number(fiyat) : oyunlar[index].fiyat,
    puan: puan !== undefined ? Number(puan) : oyunlar[index].puan
  };

  oyunlariKaydet(oyunlar);

  res.status(200).json({
    basarili: true,
    mesaj: "Oyun başarıyla güncellendi.",
    veri: oyunlar[index]
  });
});

// 5. DELETE /oyunlar/:id - Oyun sil
router.delete('/:id', (req, res) => {
  const oyunlar = oyunlariOku();
  const index = oyunlar.findIndex(o => o.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      basarili: false,
      mesaj: "Silinecek oyun bulunamadı."
    });
  }

  const silinenOyun = oyunlar.splice(index, 1);
  oyunlariKaydet(oyunlar);

  res.status(200).json({
    basarili: true,
    mesaj: "Oyun başarıyla silindi.",
    veri: silinenOyun[0]
  });
});

module.exports = router;