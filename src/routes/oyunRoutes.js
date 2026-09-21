const express = require('express');
const router = express.Router();
const { oyunlariOku, oyunlariKaydet } = require('../utils/dosya');
const oyunDogrula = require('../middleware/dogrula');

// 1. GET /oyunlar - Listeleme, Arama ve Sayfalama (Pagination)
router.get('/', (req, res) => {
  let oyunlar = oyunlariOku();
  const { ara, tur, sayfa, limit } = req.query;

  // Arama filtresi
  if (ara) {
    oyunlar = oyunlar.filter(o => 
      o.ad.toLowerCase().includes(ara.toLowerCase())
    );
  }

  // Tür filtresi
  if (tur) {
    oyunlar = oyunlar.filter(o => 
      o.tur.toLowerCase() === tur.toLowerCase()
    );
  }

  const toplamKayit = oyunlar.length;

  // Sayfalama (Pagination) mantığı
  if (sayfa || limit) {
    const aktifSayfa = parseInt(sayfa) || 1;
    const sayfaBasiLimit = parseInt(limit) || 2;
    const baslangicIndex = (aktifSayfa - 1) * sayfaBasiLimit;
    const bitisIndex = baslangicIndex + sayfaBasiLimit;

    oyunlar = oyunlar.slice(baslangicIndex, bitisIndex);

    return res.status(200).json({
      basarili: true,
      toplamKayit,
      aktifSayfa,
      sayfaBasiLimit,
      toplamSayfa: Math.ceil(toplamKayit / sayfaBasiLimit),
      veri: oyunlar
    });
  }

  res.status(200).json({
    basarili: true,
    toplamKayit,
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