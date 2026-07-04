# 📋 Aboneliklerim

Aboneliklerini terminalden takip eden basit bir CLI uygulaması. Hangi servise ne kadar ödediğini, toplam aylık maliyetini ve bu ay hangi aboneliklerin yenileneceğini gösterir.

## Özellikler

- ✅ Abonelik ekle / düzenle / sil (silmeden önce onay sorar)
- 💰 Toplam aylık ve yıllık maliyet hesabı (yıllık abonelikler aya bölünür)
- 📅 Bu ay yenilenecek abonelikler ve "X gün kaldı" göstergesi
- 🔄 Geçmişte kalan yenileme tarihlerini otomatik olarak bir sonraki döneme sarar
- 💾 Veriler yerel JSON dosyasında saklanır — internet ve hesap gerektirmez

## Kurulum

[Node.js](https://nodejs.org) kurulu olmalı (v18+).

```bash
git clone https://github.com/myozkaya/aboneliklerim.git
cd aboneliklerim
cp abonelikler.example.json abonelikler.json
node index.js
```

## Kullanım

```
1. Abonelikleri listele
2. Bu ay yenilenecekler
3. Abonelik ekle
4. Abonelik düzenle
5. Abonelik sil
6. Çıkış
```

Örnek çıktı:

```
====================================================
  Aboneliklerim
====================================================

  1. Netflix
     💰 ₺229.99 aylık  (≈₺229.99/ay)
     📅 Yenileme: 15.08.2026  (42 gün kaldı)

  2. Spotify
     💰 ₺1199.88 yıllık  (≈₺99.99/ay)
     📅 Yenileme: 01.03.2027  (240 gün kaldı)

====================================================
  Toplam aylık maliyet: ₺329.98  (yıllık ≈₺3959.76)
====================================================
```

## Veri Formatı

Abonelikler `abonelikler.json` dosyasında tutulur (bu dosya `.gitignore`'da — kişisel verin repoya girmez):

```json
{
  "abonelikler": [
    { "ad": "Netflix", "fiyat": 229.99, "periyot": "aylık", "yenileme": "15.08.2026" }
  ]
}
```

## Lisans

[MIT](LICENSE)
