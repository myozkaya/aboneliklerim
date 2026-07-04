const readline = require('readline');
const fs = require('fs');
const path = require('path');

const DOSYA = path.join(__dirname, 'abonelikler.json');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('close', () => {
  console.log('\n  Görüşürüz! 💪\n');
  process.exit(0);
});

function sor(soru) {
  return new Promise(resolve => rl.question(soru, resolve));
}

// ---- Tarih yardımcıları ----

function tarihParse(str) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(str);
  if (!m) return null;
  const [, gg, aa, yyyy] = m.map(Number);
  const d = new Date(yyyy, aa - 1, gg);
  if (d.getDate() !== gg || d.getMonth() !== aa - 1 || d.getFullYear() !== yyyy) return null;
  return d;
}

function tarihFormat(d) {
  const gg = String(d.getDate()).padStart(2, '0');
  const aa = String(d.getMonth() + 1).padStart(2, '0');
  return `${gg}.${aa}.${d.getFullYear()}`;
}

function bugunBaslangic() {
  const b = new Date();
  return new Date(b.getFullYear(), b.getMonth(), b.getDate());
}

// Geçmişte kalan yenileme tarihini periyoda göre ileri sarar.
function ileriSar(a) {
  const d = tarihParse(a.yenileme);
  if (!d) return false;
  const bugun = bugunBaslangic();
  let degisti = false;
  while (d < bugun) {
    if (a.periyot === 'yıllık') d.setFullYear(d.getFullYear() + 1);
    else d.setMonth(d.getMonth() + 1);
    degisti = true;
  }
  if (degisti) a.yenileme = tarihFormat(d);
  return degisti;
}

function gunKaldi(a) {
  const d = tarihParse(a.yenileme);
  if (!d) return null;
  return Math.round((d - bugunBaslangic()) / 86400000);
}

// ---- Veri ----

function veriYukle() {
  if (!fs.existsSync(DOSYA)) return { abonelikler: [] };
  try {
    const veri = JSON.parse(fs.readFileSync(DOSYA, 'utf8'));
    if (!Array.isArray(veri.abonelikler)) throw new Error('abonelikler listesi bulunamadı');
    return veri;
  } catch (e) {
    console.error(`\n  ⚠️  ${path.basename(DOSYA)} okunamadı: ${e.message}`);
    console.error('  Dosyayı düzeltmeden devam edersen üzerine yazılabilir. Çıkılıyor.\n');
    process.exit(1);
  }
}

function veriKaydet(veri) {
  try {
    fs.writeFileSync(DOSYA, JSON.stringify(veri, null, 2), 'utf8');
  } catch (e) {
    console.error(`  ⚠️  Kaydedilemedi: ${e.message}`);
  }
}

function aylikMaliyet(a) {
  return a.periyot === 'yıllık' ? a.fiyat / 12 : a.fiyat;
}

// ---- Ekranlar ----

function listele(veri) {
  const { abonelikler } = veri;
  if (!abonelikler.length) {
    console.log('\n  Henüz abonelik yok.\n');
    return;
  }

  console.log('\n' + '='.repeat(52));
  console.log('  Aboneliklerim');
  console.log('='.repeat(52));

  abonelikler.forEach((a, i) => {
    const kalan = gunKaldi(a);
    const kalanStr = kalan === null ? '' : kalan === 0 ? '  ⚠️ BUGÜN!' : `  (${kalan} gün kaldı)`;
    console.log(`\n  ${i + 1}. ${a.ad}`);
    console.log(`     💰 ₺${a.fiyat.toFixed(2)} ${a.periyot}  (≈₺${aylikMaliyet(a).toFixed(2)}/ay)`);
    console.log(`     📅 Yenileme: ${a.yenileme}${kalanStr}`);
  });

  const toplam = abonelikler.reduce((t, a) => t + aylikMaliyet(a), 0);
  console.log('\n' + '='.repeat(52));
  console.log(`  Toplam aylık maliyet: ₺${toplam.toFixed(2)}  (yıllık ≈₺${(toplam * 12).toFixed(2)})`);
  console.log('='.repeat(52) + '\n');
}

function buAy(veri) {
  const bugun = new Date();
  const liste = veri.abonelikler.filter(a => {
    const d = tarihParse(a.yenileme);
    return d && d.getMonth() === bugun.getMonth() && d.getFullYear() === bugun.getFullYear();
  });
  const etiket = bugun.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });

  console.log('\n' + '='.repeat(52));
  console.log(`  Bu Ay Yenilenecekler (${etiket})`);
  console.log('='.repeat(52));

  if (!liste.length) {
    console.log('\n  Bu ay yenilenecek abonelik yok.\n');
    return;
  }

  liste.forEach(a => {
    const kalan = gunKaldi(a);
    console.log(`\n  ⚠️  ${a.ad}`);
    console.log(`     💰 ₺${a.fiyat.toFixed(2)} (${a.periyot})`);
    console.log(`     📅 ${a.yenileme}${kalan === 0 ? ' — BUGÜN' : ` — ${kalan} gün kaldı`}`);
  });

  const toplam = liste.reduce((t, a) => t + a.fiyat, 0);
  console.log(`\n  Bu ay ödenecek toplam: ₺${toplam.toFixed(2)}`);
  console.log('='.repeat(52) + '\n');
}

// ---- Girdi yardımcıları ----

async function fiyatSor(mevcut) {
  const ipucu = mevcut !== undefined ? ` [${mevcut}]` : '';
  const str = (await sor(`  Fiyat (₺)${ipucu}: `)).trim();
  if (!str && mevcut !== undefined) return mevcut;
  const fiyat = parseFloat(str.replace(',', '.'));
  if (isNaN(fiyat) || fiyat <= 0) {
    console.log('  Geçersiz fiyat — 0\'dan büyük bir sayı gir.');
    return null;
  }
  return fiyat;
}

async function periyotSor(mevcut) {
  const ipucu = mevcut ? ` [${mevcut}]` : '';
  const g = (await sor(`  Periyot (a=aylık, y=yıllık)${ipucu}: `)).trim().toLowerCase();
  if (!g && mevcut) return mevcut;
  if (g === 'a') return 'aylık';
  if (g === 'y') return 'yıllık';
  console.log('  Geçersiz periyot — sadece "a" veya "y" gir.');
  return null;
}

async function tarihSor(mevcut) {
  const ipucu = mevcut ? ` [${mevcut}]` : '';
  const str = (await sor(`  Yenileme tarihi (gg.aa.yyyy)${ipucu}: `)).trim();
  if (!str && mevcut) return mevcut;
  if (!tarihParse(str)) {
    console.log('  Geçersiz tarih — örnek: 15.08.2026');
    return null;
  }
  return str;
}

// ---- İşlemler ----

async function ekle(veri) {
  const ad = (await sor('  Abonelik adı: ')).trim();
  if (!ad) { console.log('  İptal edildi.\n'); return; }
  if (veri.abonelikler.some(a => a.ad.toLowerCase() === ad.toLowerCase())) {
    console.log(`  "${ad}" zaten kayıtlı.\n`);
    return;
  }

  const fiyat = await fiyatSor();
  if (fiyat === null) return;
  const periyot = await periyotSor();
  if (periyot === null) return;
  const yenileme = await tarihSor();
  if (yenileme === null) return;

  const yeni = { ad, fiyat, periyot, yenileme };
  ileriSar(yeni);
  veri.abonelikler.push(yeni);
  veriKaydet(veri);
  console.log(`\n  ✅ ${ad} eklendi.\n`);
}

async function duzenle(veri) {
  listele(veri);
  if (!veri.abonelikler.length) return;

  const secim = parseInt((await sor('  Düzenlenecek numara: ')).trim());
  if (isNaN(secim) || secim < 1 || secim > veri.abonelikler.length) {
    console.log('  Geçersiz numara.\n');
    return;
  }
  const a = veri.abonelikler[secim - 1];
  console.log('  Boş bırakırsan mevcut değer korunur.');

  const ad = (await sor(`  Ad [${a.ad}]: `)).trim() || a.ad;
  const fiyat = await fiyatSor(a.fiyat);
  if (fiyat === null) return;
  const periyot = await periyotSor(a.periyot);
  if (periyot === null) return;
  const yenileme = await tarihSor(a.yenileme);
  if (yenileme === null) return;

  Object.assign(a, { ad, fiyat, periyot, yenileme });
  ileriSar(a);
  veriKaydet(veri);
  console.log(`\n  ✅ ${ad} güncellendi.\n`);
}

async function sil(veri) {
  listele(veri);
  if (!veri.abonelikler.length) return;

  const secim = parseInt((await sor('  Silinecek numara: ')).trim());
  if (isNaN(secim) || secim < 1 || secim > veri.abonelikler.length) {
    console.log('  Geçersiz numara.\n');
    return;
  }
  const a = veri.abonelikler[secim - 1];
  const onay = (await sor(`  "${a.ad}" silinsin mi? (e/h): `)).trim().toLowerCase();
  if (onay !== 'e') {
    console.log('  İptal edildi.\n');
    return;
  }

  veri.abonelikler.splice(secim - 1, 1);
  veriKaydet(veri);
  console.log(`\n  ✅ ${a.ad} silindi.\n`);
}

// ---- Ana döngü ----

async function menu() {
  const veri = veriYukle();

  // Geçmişte kalan yenileme tarihlerini ileri sar
  let sarildi = 0;
  veri.abonelikler.forEach(a => { if (ileriSar(a)) sarildi++; });
  if (sarildi > 0) {
    veriKaydet(veri);
    console.log(`  ℹ️  ${sarildi} aboneliğin yenileme tarihi bir sonraki döneme güncellendi.`);
  }

  console.log('\n  Abonelik Takip Uygulamasına Hoş Geldin!\n');

  while (true) {
    console.log('1. Abonelikleri listele');
    console.log('2. Bu ay yenilenecekler');
    console.log('3. Abonelik ekle');
    console.log('4. Abonelik düzenle');
    console.log('5. Abonelik sil');
    console.log('6. Çıkış');
    const secim = (await sor('\n> ')).trim();

    if (secim === '1') listele(veri);
    else if (secim === '2') buAy(veri);
    else if (secim === '3') await ekle(veri);
    else if (secim === '4') await duzenle(veri);
    else if (secim === '5') await sil(veri);
    else if (secim === '6') { rl.close(); break; }
    else console.log('  Geçersiz seçim.\n');
  }
}

menu();
