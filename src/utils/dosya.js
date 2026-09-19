const fs = require('fs');
const path = require('path');

// data/oyunlar.json dosyasının tam yolunu alıyoruz
const dosyaYolu = path.join(__dirname, '../../data/oyunlar.json');

// Dosyadaki oyunları okuyup array olarak döndürür
const oyunlariOku = () => {
  try {
    const veri = fs.readFileSync(dosyaYolu, 'utf-8');
    return JSON.parse(veri);
  } catch (error) {
    return [];
  }
};

// Yeni veya güncellenen oyun listesini dosyaya yazar
const oyunlariKaydet = (oyunlar) => {
  fs.writeFileSync(dosyaYolu, JSON.stringify(oyunlar, null, 2), 'utf-8');
};

module.exports = {
  oyunlariOku,
  oyunlariKaydet
};