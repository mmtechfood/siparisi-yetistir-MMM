# Görsel Varlıklar (Asset Rehberi)

Oyun şu an **kodla çizilen geçici görsellerle** tam oynanabilir. Yüksek kaliteli PNG/WebP dosyalarını
aşağıdaki isimlerle koyup `js/config.js` içinde açtığınızda otomatik devreye girer. **Dosya boyutu veya şekli
değişse bile oyun mekaniği bozulmaz**: her görsel config'teki sabit çizim kutusuna sığdırılır.

> Bu liste `js/config.js`'ten üretilmiştir. Yeni malzeme/yemek eklemek için `INGREDIENTS` ve `DISHES`
> bölümlerine kayıt eklemeniz yeterli.

## Nasıl devreye alınır
1. Dosyayı `assets/img/<klasör>/<ad>.png` olarak koyun (webp için `ASSET_EXT: 'webp'`).
2. `js/config.js` → `AVAILABLE: { patty: true, icon_patty: true }` ya da hepsini yüklediyseniz `TRY_ALL_FILES: true`.
3. Sayfayı yenileyin. Dosya bulunamazsa o görsel için yedek çizim kullanılır.

## Yemekler
| Yemek | Başlangıç | Bitiş | Ara malzemeler | Çıkış |
|---|---|---|---|---|
| Hamburger | Alt Ekmek | Üst Ekmek | Köfte, Peynir, Marul, Domates | 1. siparişten |
| Tost | Alt Ekmek | Üst Ekmek | Kaşar, Sucuk, Domates, Turşu | 1. siparişten |
| Sosisli | Ekmek | Üst Ekmek | Sosis, Ketçap, Hardal, Turşu | 2. siparişten |
| Çilekli Pasta | Kek | Vişne | Krema, Çilek, Çikolata, Kek | 2. siparişten |
| Pankek | Pankek | Çilek | Tereyağı, Bal, Muz, Çikolata, Pankek | 3. siparişten |
| Waffle | Waffle | Vişne | Çikolata, Muz, Çilek, Krema | 4. siparişten |
| Dondurma | Kase | Vişne | Vanilya, Çikolata, Çilek, Fıstık | 4. siparişten |

## Malzeme sprite'ları (yan görünüm, şeffaf arka plan) — `assets/img/ingredients/`
| Dosya | px (2x) | Çizim kutusu | Görünen kalınlık (step) | Kullanıldığı yemekler |
|---|---|---|---|---|
| `bun_bottom.png` (Alt Ekmek) | 600 × 124 | 300 × 62 | 50 px | Hamburger |
| `patty.png` (Köfte) | 592 × 92 | 296 × 46 | 34 px | Hamburger |
| `cheese.png` (Peynir) | 624 × 72 | 312 × 36 | 20 px | Hamburger |
| `lettuce.png` (Marul) | 664 × 84 | 332 × 42 | 26 px | Hamburger |
| `tomato.png` (Domates) | 584 × 68 | 292 × 34 | 22 px | Hamburger, Tost |
| `bun_top.png` (Üst Ekmek) | 600 × 184 | 300 × 92 | 70 px | Hamburger |
| `toast_bottom.png` (Alt Ekmek) | 600 × 100 | 300 × 50 | 38 px | Tost |
| `toast_top.png` (Üst Ekmek) | 600 × 116 | 300 × 58 | 44 px | Tost |
| `kasar.png` (Kaşar) | 624 × 72 | 312 × 36 | 20 px | Tost |
| `sucuk.png` (Sucuk) | 592 × 68 | 296 × 34 | 22 px | Tost |
| `pickle.png` (Turşu) | 564 × 60 | 282 × 30 | 20 px | Tost, Sosisli |
| `butter.png` (Tereyağı) | 560 × 60 | 280 × 30 | 24 px | Pankek |
| `cake.png` (Kek) | 608 × 104 | 304 × 52 | 40 px | Çilekli Pasta |
| `cream.png` (Krema) | 592 × 76 | 296 × 38 | 30 px | Çilekli Pasta, Waffle |
| `strawberry.png` (Çilek) | 560 × 68 | 280 × 34 | 22 px | Çilekli Pasta, Pankek, Waffle |
| `chocolate.png` (Çikolata) | 584 × 68 | 292 × 34 | 26 px | Çilekli Pasta, Pankek, Waffle |
| `cherry.png` (Vişne) | 200 × 148 | 100 × 74 | 40 px | Çilekli Pasta, Waffle, Dondurma |
| `dog_bun.png` (Ekmek) | 680 × 112 | 340 × 56 | 44 px | Sosisli |
| `sausage.png` (Sosis) | 640 × 80 | 320 × 40 | 28 px | Sosisli |
| `ketchup.png` (Ketçap) | 600 × 68 | 300 × 34 | 26 px | Sosisli |
| `mustard.png` (Hardal) | 600 × 68 | 300 × 34 | 26 px | Sosisli |
| `dog_top.png` (Üst Ekmek) | 680 × 156 | 340 × 78 | 60 px | Sosisli |
| `pancake.png` (Pankek) | 600 × 92 | 300 × 46 | 34 px | Pankek |
| `honey.png` (Bal) | 580 × 68 | 290 × 34 | 26 px | Pankek |
| `waffle.png` (Waffle) | 620 × 100 | 310 × 50 | 38 px | Waffle |
| `banana.png` (Muz) | 580 × 68 | 290 × 34 | 22 px | Pankek, Waffle |
| `cup.png` (Kase) | 460 × 140 | 230 × 70 | 50 px | Dondurma |
| `scoop_vanilla.png` (Vanilya) | 340 × 168 | 170 × 84 | 46 px | Dondurma |
| `scoop_choc.png` (Çikolata) | 340 × 168 | 170 × 84 | 46 px | Dondurma |
| `scoop_straw.png` (Çilek) | 340 × 168 | 170 × 84 | 46 px | Dondurma |
| `scoop_pistachio.png` (Fıstık) | 340 × 168 | 170 × 84 | 46 px | Dondurma |

**Katman kuralı:** Her malzeme bir sonrakinin altına biner. Görünen kısım, **alt kenardan itibaren `step` px**'tir;
üstteki kısım sonraki katmanın arkasında kalır. Detayı (kenar, damlalar, doku) alt `step` bölgesine koyun.
Bir yemeğin **son** malzemesi (üst ekmek, vişne, biber...) tamamen görünür.

## İkonlar (butonlar ve sipariş kartı, 3/4 görünüm) — `assets/img/icons/`
Her malzeme için **240 × 240** px, kare, ortalı:

`icon_bun_bottom.png`, `icon_patty.png`, `icon_cheese.png`, `icon_lettuce.png`, `icon_tomato.png`, `icon_bun_top.png`, `icon_toast_bottom.png`, `icon_toast_top.png`, `icon_kasar.png`, `icon_sucuk.png`, `icon_pickle.png`, `icon_butter.png`, `icon_cake.png`, `icon_cream.png`, `icon_strawberry.png`, `icon_chocolate.png`, `icon_cherry.png`, `icon_dog_bun.png`, `icon_sausage.png`, `icon_ketchup.png`, `icon_mustard.png`, `icon_dog_top.png`, `icon_pancake.png`, `icon_honey.png`, `icon_waffle.png`, `icon_banana.png`, `icon_cup.png`, `icon_scoop_vanilla.png`, `icon_scoop_choc.png`, `icon_scoop_straw.png`, `icon_scoop_pistachio.png`

## Sahne — `assets/img/scene/`
| Dosya | px | Not |
|---|---|---|
| `bg_kitchen.png` / `.jpg` | 1080 × 1920 | Arka plan. Üst 0–110 HUD, 112–284 sipariş kartı, 640–700 tezgâh yüzeyi (tabak buraya oturur), 706 altı buton paneli. Orta bölgeyi sade bırakın. |
| `plate.png` | 760 × 118 | Tabak (perspektifli). Yüzey merkezi yüksekliğin ~%50'si. |
| `board.png` | 720 × 112 | Servis tahtası (burger, tost, sosisli, pizza, döner). Yüzey `plate` ile aynı hizada. |
| `stand.png` | 720 × 148 | Kek standı (pasta, waffle). Yüzey üstte, ayak altta. |

## Arayüz — `assets/img/ui/`
| Dosya | px | Not |
|---|---|---|
| `logo.png` | 880 × 340 | Oyun logosu; varsa menüdeki yazı logosunun yerini alır. |
| `mascot.png` | ~550 × 640 | Oyun içi karakter (şeffaf PNG). Solda yarısı görünür. Zorunlu: yoksa karakter çizilmez. |
| `mascot_menu.png` | ~540 × 640 | Ana menüdeki karakter (telefonsuz, tabelanın arkasında). |
| `glove.png` | ~180 × 180 | Tabelayı tutan eldiven (sağ el otomatik ters çevrilir). |

Karakterin sözleri `js/mascot.js` içindeki `MSG` bölümünde. Başarı, hata, "az kaldı" gibi türlere istediğiniz cümleyi ekleyebilirsiniz.

## Ses — `assets/audio/`
- `music.mp3`: arka plan müziği (döngüye girer). Dosyayı değiştirerek müziği değiştirebilirsiniz.
- Efekt sesleri (dokunuş, hata, servis, kupon, süre ticki) kodla üretilir, dosya gerekmez.
- Oyuncu ses seviyesini menüdeki dişli (Ayarlar) ekranından ayarlar; tercih telefonda saklanır.
