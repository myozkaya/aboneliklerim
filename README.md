# 📋 Aboneliklerim

Aboneliklerini terminalden takip eden basit bir CLI (komut satırı) uygulaması. Hangi servise ne kadar ödediğini, toplam aylık maliyetini ve bu ay hangi aboneliklerin yenileneceğini gösterir.

> **Not:** Bu bir terminal uygulamasıdır — ikonu olan, çift tıklanarak açılan bir uygulama değildir. Terminal'den komutla çalıştırılır. Aşağıda adım adım anlatılıyor.

## Özellikler

- ✅ Abonelik ekle / düzenle / sil (silmeden önce onay sorar)
- 💰 Toplam aylık ve yıllık maliyet hesabı (yıllık abonelikler aya bölünür)
- 📅 Bu ay yenilenecek abonelikler ve "X gün kaldı" göstergesi
- 🔄 Geçmişte kalan yenileme tarihlerini otomatik olarak bir sonraki döneme sarar
- 💾 Veriler yerel JSON dosyasında saklanır — internet ve hesap gerektirmez

## Gereksinimler

- [Node.js](https://nodejs.org) v18 veya üzeri

Kurulu olup olmadığını kontrol etmek için Terminal'e şunu yaz:

```bash
node --version
```

`v18.0.0` gibi bir sürüm numarası görüyorsan hazırsın. `command not found` diyorsa [nodejs.org](https://nodejs.org)'dan indir (macOS'ta alternatif: `brew install node`).

## Kurulum — Adım Adım

**1.** Terminal'i aç (macOS: Spotlight'a "Terminal" yaz · Windows: PowerShell).

**2.** Projeyi indir ve klasöre gir:

```bash
git clone https://github.com/myozkaya/aboneliklerim.git
cd aboneliklerim
```

**3.** Örnek veri dosyasını kopyala (uygulama verilerini bu dosyada saklar):

```bash
cp abonelikler.example.json abonelikler.json
```

**4.** Uygulamayı başlat:

```bash
node index.js
```

## Kullanım

Uygulama açılınca şu menü gelir. Yapmak istediğin işlemin numarasını yazıp Enter'a bas:

```
1. Abonelikleri listele      → tüm abonelikler + toplam aylık/yıllık maliyet
2. Bu ay yenilenecekler      → bu ay ödeme çıkacak abonelikler ve kalan gün
3. Abonelik ekle             → ad, fiyat, periyot (aylık/yıllık), yenileme tarihi sorar
4. Abonelik düzenle          → mevcut bir kaydın herhangi bir alanını değiştir
5. Abonelik sil              → onay sorarak siler
6. Çıkış
```

### Örnek: abonelik ekleme

```
> 3
  Abonelik adı: Netflix
  Fiyat (₺): 229.99
  Periyot (a=aylık, y=yıllık): a
  Yenileme tarihi (gg.aa.yyyy): 15.08.2026

  ✅ Netflix eklendi.
```

### Örnek: listeleme çıktısı

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

## Her Gün Kolayca Açmak (isteğe bağlı)

Her seferinde uzun komut yazmamak için terminaline bir kısayol (alias) ekleyebilirsin.

**macOS / Linux** — `~/.zshrc` (veya `~/.bashrc`) dosyasına şu satırı ekle:

```bash
alias abonelikler="node ~/Desktop/aboneliklerim/index.js"
```

Yeni terminal açtığında artık sadece şunu yazman yeterli:

```bash
abonelikler
```

> Klasörü başka bir yere indirdiysen yoldaki `~/Desktop/aboneliklerim` kısmını kendi konumunla değiştir.

## VS Code veya IntelliJ'den çalıştırma

Bu editörler kodu *düzenlemek* içindir; uygulama yine terminalde çalışır. Editörün içindeki terminali kullanabilirsin:

- **VS Code:** klasörü aç → üst menüden **Terminal → New Terminal** → `node index.js`
- **IntelliJ:** alttaki **Terminal** sekmesi → `node index.js`

## Veri Formatı

Abonelikler `abonelikler.json` dosyasında tutulur (bu dosya `.gitignore`'da — kişisel verin repoya girmez):

```json
{
  "abonelikler": [
    { "ad": "Netflix", "fiyat": 229.99, "periyot": "aylık", "yenileme": "15.08.2026" }
  ]
}
```

## Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|---|---|
| `command not found: node` | Node.js kurulu değil — [nodejs.org](https://nodejs.org)'dan kur |
| `Cannot find module .../index.js` | Yanlış klasördesin — `cd aboneliklerim` ile proje klasörüne gir |
| `abonelikler.json okunamadı` | Dosya bozulmuş — `cp abonelikler.example.json abonelikler.json` ile sıfırla |
| Türkçe karakterler bozuk görünüyor | Terminalinin kodlaması UTF-8 olmalı (macOS'ta varsayılan böyledir) |

## Lisans

[MIT](LICENSE)
