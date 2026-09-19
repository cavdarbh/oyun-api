// POST ve PUT isteklerinde gövdeyi (body) denetleyen middleware
const oyunDogrula = (req, res, next) => {
  const { ad, tur } = req.body;

  // 'ad' veya 'tur' eksikse istek rotaya ulaşmadan 400 döner
  if (!ad || !tur) {
    return res.status(400).json({
      basarili: false,
      mesaj: "Hata: 'ad' ve 'tur' alanları zorunludur."
    });
  }

  next();
};

module.exports = oyunDogrula;