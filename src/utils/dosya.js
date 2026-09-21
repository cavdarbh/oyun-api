const fs = require('fs');
const path = require('path');

const oyunlarYolu = path.join(__dirname, '../../data/oyunlar.json');
const kullanicilarYolu = path.join(__dirname, '../../data/kullanicilar.json');

// Oyun işlemleri
const oyunlariOku = () => {
  try {
    return JSON.parse(fs.readFileSync(oyunlarYolu, 'utf-8'));
  } catch (error) {
    return [];
  }
};

const oyunlariKaydet = (oyunlar) => {
  fs.writeFileSync(oyunlarYolu, JSON.stringify(oyunlar, null, 2), 'utf-8');
};

// Kullanıcı işlemleri
const kullanicilariOku = () => {
  try {
    return JSON.parse(fs.readFileSync(kullanicilarYolu, 'utf-8'));
  } catch (error) {
    return [];
  }
};

const kullanicilariKaydet = (kullanicilar) => {
  fs.writeFileSync(kullanicilarYolu, JSON.stringify(kullanicilar, null, 2), 'utf-8');
};

module.exports = {
  oyunlariOku,
  oyunlariKaydet,
  kullanicilariOku,
  kullanicilariKaydet
};