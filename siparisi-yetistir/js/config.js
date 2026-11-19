/* Motion Menü – Siparişi Yetiştir
 * config.js: tüm ayarlar tek yerde. Yemekleri, malzemeleri, zorluğu ve ödülü buradan ayarlayın. */
(function () {
  'use strict';
  var MM = (window.MM = window.MM || {});

  /* ---------- Malzemeler ----------
   * w/h   : oyundaki çizim kutusu (mantıksal px)
   * step  : bu katmanın yığını kaç px yükselttiği (üstündeki katman biner)
   * art   : yan görünüm sprite tarifi (assets.js). Dosya varsa dosya kullanılır.
   * icon  : buton/çip ikonu tarifi
   * dark  : buton alt gölge rengi */
  var I = {
    /* hamburger */
    bun_bottom: { label: 'Alt Ekmek', w: 300, h: 62, step: 50, dark: '#a8620f', art: { fn: 'bunBottom' }, icon: { fn: 'iconBunBottom' } },
    patty:      { label: 'Köfte',     w: 296, h: 46, step: 34, dark: '#5a2a12', art: { fn: 'patty' },     icon: { fn: 'iconPatty' } },
    cheese:     { label: 'Peynir',    w: 312, h: 36, step: 20, dark: '#c98a00', art: { fn: 'cheese' },    icon: { fn: 'iconCheese' } },
    lettuce:    { label: 'Marul',     w: 332, h: 42, step: 26, dark: '#2f8a1a', art: { fn: 'lettuce' },   icon: { fn: 'iconLettuce' } },
    tomato:     { label: 'Domates',   w: 292, h: 34, step: 22, dark: '#a51d12',
                  art: { fn: 'slices', top: '#ff7762', mid: '#e23a2b', bot: '#b4231a', line: 'rgba(120,10,0,.35)', dot: '#ffe9a6', pat: 'seeds' }, icon: { fn: 'iconTomato' } },
    bun_top:    { label: 'Üst Ekmek', w: 300, h: 92, step: 70, dark: '#a8620f', art: { fn: 'bunTop' },     icon: { fn: 'iconBunTop' } },

    /* tost */
    toast_bottom: { label: 'Alt Ekmek', w: 300, h: 50, step: 38, dark: '#a8651b',
                    art: { fn: 'slab', top: '#f9dc92', mid: '#ebb558', bot: '#cf9040', crust: '#a8651b', cw: 12, lip: 10, lipc: 'rgba(255,248,215,.7)' },
                    icon: { fn: 'iconToast', body: ['#fbe3a2', '#eab458'], crust: '#a8651b' } },
    toast_top:    { label: 'Üst Ekmek', w: 300, h: 58, step: 44, dark: '#a8651b',
                    art: { fn: 'slab', top: '#f2c46a', mid: '#dba04a', bot: '#c0802f', crust: '#a8651b', cw: 12, r4: [26, 26, 12, 12], mark: 'grill' },
                    icon: { fn: 'iconToast', body: ['#f2c46a', '#d9a04a'], crust: '#a8651b', grill: true } },
    kasar:   { label: 'Kaşar',   w: 312, h: 36, step: 20, dark: '#b89420',
               art: { fn: 'cheese', top: '#fff8d2', c1: '#fff3b8', c2: '#f7dc6a', c3: '#e2b83c' }, icon: { fn: 'iconCheese', c1: '#fff3b8', c2: '#f3cf4a' } },
    sucuk:   { label: 'Sucuk',   w: 296, h: 34, step: 22, dark: '#6a1c10',
               art: { fn: 'slices', top: '#d65a48', mid: '#a8321f', bot: '#6e1c10', line: 'rgba(40,5,0,.4)', dot: '#f6dccb', pat: 'fat' },
               icon: { fn: 'iconSlice', outer: '#7e2416', inner: '#c4483a', pat: 'fat', dot: '#f6dccb' } },
    pickle:  { label: 'Turşu',   w: 282, h: 30, step: 20, dark: '#476616',
               art: { fn: 'slices', top: '#9cc24a', mid: '#5f8a26', bot: '#3d5f14', line: 'rgba(20,45,0,.4)', dot: '#cfe48a', pat: 'bumps' },
               icon: { fn: 'iconPickle' } },
    butter:  { label: 'Tereyağı', w: 280, h: 30, step: 24, dark: '#c08a10',
               art: { fn: 'drizzle', c1: '#ffe680', c2: '#f2b51c', ph: 3.1 }, icon: { fn: 'iconCube' } },
    cake:       { label: 'Kek', w: 304, h: 52, step: 40, dark: '#b9792a',
                  art: { fn: 'slab', top: '#ffeaa8', mid: '#f4c96e', bot: '#dba040', crust: '#b9792a', cw: 8, r4: [10, 10, 14, 14], mark: 'crumb', lip: 9, lipc: 'rgba(255,255,230,.55)' }, icon: { fn: 'iconCake' } },
    cream:      { label: 'Krema', w: 296, h: 38, step: 30, dark: '#c9a878',
                  art: { fn: 'drizzle', c1: '#fffdf6', c2: '#f3e1c2', ph: 0.5, bumps: true, drips: [.3, .72] }, icon: { fn: 'iconSwirl' } },
    strawberry: { label: 'Çilek', w: 280, h: 34, step: 22, dark: '#a8141f',
                  art: { fn: 'slices', top: '#ff7a7a', mid: '#e0263a', bot: '#a8141f', line: 'rgba(100,0,10,.3)', dot: '#ffe9a6', pat: 'berry' }, icon: { fn: 'iconBerry' } },
    chocolate:  { label: 'Çikolata', w: 292, h: 34, step: 26, dark: '#3e1d0f',
                  art: { fn: 'drizzle', c1: '#8a5230', c2: '#3e1d0f', ph: 1.7, drips: [.15, .4, .66, .88] }, icon: { fn: 'iconBowl', bowl: '#f4efe6', c: '#5a2e17' } },
    cherry:     { label: 'Vişne', w: 100, h: 74, step: 40, dark: '#8a1020', art: { fn: 'cherry' }, icon: { fn: 'iconCherries' } },

    /* sosisli */
    dog_bun:  { label: 'Ekmek', w: 340, h: 56, step: 44, dark: '#a8620f', art: { fn: 'bunBottom' }, icon: { fn: 'iconBunBottom' } },
    sausage:  { label: 'Sosis', w: 320, h: 40, step: 28, dark: '#8a2a18', art: { fn: 'tube', c1: '#e88a70', c2: '#b3452c', c3: '#7a2414' }, icon: { fn: 'iconSausage' } },
    ketchup:  { label: 'Ketçap', w: 300, h: 34, step: 26, dark: '#a51d12', art: { fn: 'drizzle', c1: '#ff5a3c', c2: '#c01e14', ph: 0.4, drips: [.12, .38, .62, .86] }, icon: { fn: 'iconBottle', c: '#e8341f', cap: '#ffffff' } },
    mustard:  { label: 'Hardal', w: 300, h: 34, step: 26, dark: '#b88a00', art: { fn: 'drizzle', c1: '#ffe14a', c2: '#e0a800', ph: 2.6, drips: [.2, .5, .78] }, icon: { fn: 'iconBottle', c: '#f6c81a', cap: '#d9a100' } },
    dog_top:  { label: 'Üst Ekmek', w: 340, h: 78, step: 60, dark: '#a8620f', art: { fn: 'bunTop' }, icon: { fn: 'iconBunTop' } },

    /* pankek */
    pancake:  { label: 'Pankek', w: 300, h: 46, step: 34, dark: '#a8641c',
                art: { fn: 'slab', top: '#f6cb86', mid: '#dea050', bot: '#b9732a', crust: '#a8641c', cw: 8, r4: [16, 16, 20, 20], mark: 'spots', lip: 8, lipc: 'rgba(255,240,200,.45)' }, icon: { fn: 'iconPancake' } },
    honey:    { label: 'Bal', w: 290, h: 34, step: 26, dark: '#b87800',
                art: { fn: 'drizzle', c1: '#ffcc3a', c2: '#d98a00', ph: 1.3, drips: [.18, .45, .7, .9] }, icon: { fn: 'iconJar', c: '#f2a81a' } },

    /* waffle */
    waffle:   { label: 'Waffle', w: 310, h: 50, step: 38, dark: '#a8651b',
                art: { fn: 'slab', top: '#f6cd78', mid: '#e3a64c', bot: '#b87a2a', crust: '#9a5a18', cw: 8, r4: [12, 12, 16, 16], mark: 'grid' }, icon: { fn: 'iconWaffle' } },
    banana:   { label: 'Muz', w: 290, h: 34, step: 22, dark: '#b8901a',
                art: { fn: 'slices', top: '#fff4b0', mid: '#f6d84e', bot: '#d9a926', line: 'rgba(120,80,0,.35)', dot: '#7a5a1a', pat: 'seeds' }, icon: { fn: 'iconBanana' } },

    /* dondurma */
    cup:      { label: 'Kase', w: 230, h: 70, step: 50, dark: '#5a8ab8', art: { fn: 'cup' }, icon: { fn: 'iconCup' } },
    scoop_vanilla:   { label: 'Vanilya', w: 170, h: 84, step: 46, dark: '#c9a860', art: { fn: 'scoop', c1: '#fff8dc', c2: '#f3dc9c', c3: '#d9b866' }, icon: { fn: 'iconScoop', c1: '#fff8dc', c2: '#e8cc84' } },
    scoop_choc:      { label: 'Çikolata', w: 170, h: 84, step: 46, dark: '#3e1d0f', art: { fn: 'scoop', c1: '#9a6240', c2: '#6a3a1e', c3: '#41200e' }, icon: { fn: 'iconScoop', c1: '#9a6240', c2: '#5a2f16' } },
    scoop_straw:     { label: 'Çilek', w: 170, h: 84, step: 46, dark: '#c04a6a', art: { fn: 'scoop', c1: '#ffc4d4', c2: '#f78aa8', c3: '#d65078' }, icon: { fn: 'iconScoop', c1: '#ffc4d4', c2: '#f27a9c' } },
    scoop_pistachio: { label: 'Fıstık', w: 170, h: 84, step: 46, dark: '#5a8a2a', art: { fn: 'scoop', c1: '#d6ee9a', c2: '#a4cc5a', c3: '#78a032' }, icon: { fn: 'iconScoop', c1: '#d6ee9a', c2: '#98c050' } }
  };
  Object.keys(I).forEach(function (k) { I[k].sprite = k; I[k].iconKey = 'icon_' + k; });

  /* ---------- Yemekler ----------
   * base/finish : sipariş her zaman bununla başlar / biter
   * pool        : arada kullanılabilecek malzemeler     must: her siparişte mutlaka olanlar
   * dups        : iki kez gelebilecek malzemeler        menu: alttaki butonlar (en çok 6)
   * first       : (isteğe bağlı) ara malzemelerin başına sırayla konacaklar (örn. sosis ekmeğin hemen üstüne)
   * from        : kaçıncı siparişten itibaren çıkabilir (zorluk kademesi)
   * plate       : tabak türü (plate | board | stand)    hot: buhar çıkar     pick: bitince kürdan bayrağı */
  var D = {
    burger:   { name: 'Hamburger',     base: 'bun_bottom', finish: 'bun_top', pool: ['patty', 'cheese', 'lettuce', 'tomato'], must: ['patty'], dups: ['patty'],
                menu: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'], from: 0, plate: 'board', hot: true, pick: true },
    tost:     { name: 'Tost',          base: 'toast_bottom', finish: 'toast_top', pool: ['kasar', 'sucuk', 'tomato', 'pickle'], must: ['kasar'], dups: [],
                menu: ['toast_bottom', 'kasar', 'sucuk', 'tomato', 'pickle', 'toast_top'], from: 0, plate: 'board', hot: true, pick: true },
    hotdog:   { name: 'Sosisli',       base: 'dog_bun', finish: 'dog_top', pool: ['sausage', 'ketchup', 'mustard', 'pickle'], must: ['sausage'], dups: [], first: ['sausage'],
                menu: ['dog_bun', 'sausage', 'ketchup', 'mustard', 'pickle', 'dog_top'], from: 1, plate: 'board', hot: true, pick: false },
    pasta:    { name: 'Çilekli Pasta', base: 'cake', finish: 'cherry', pool: ['cream', 'strawberry', 'chocolate', 'cake'], must: ['cream'], dups: ['cake'],
                menu: ['cake', 'cream', 'strawberry', 'chocolate', 'cherry'], from: 1, plate: 'stand', hot: false, pick: false },
    pankek:   { name: 'Pankek',        base: 'pancake', finish: 'strawberry', pool: ['butter', 'honey', 'banana', 'chocolate', 'pancake'], must: ['butter'], dups: ['pancake'],
                menu: ['pancake', 'butter', 'honey', 'banana', 'chocolate', 'strawberry'], from: 2, plate: 'plate', hot: true, pick: false },
    waffle:   { name: 'Waffle',        base: 'waffle', finish: 'cherry', pool: ['chocolate', 'banana', 'strawberry', 'cream'], must: ['chocolate'], dups: [],
                menu: ['waffle', 'chocolate', 'banana', 'strawberry', 'cream', 'cherry'], from: 3, plate: 'stand', hot: false, pick: false },
    dondurma: { name: 'Dondurma',      base: 'cup', finish: 'cherry', pool: ['scoop_vanilla', 'scoop_choc', 'scoop_straw', 'scoop_pistachio'], must: [], dups: ['scoop_vanilla', 'scoop_choc', 'scoop_straw', 'scoop_pistachio'],
                menu: ['cup', 'scoop_vanilla', 'scoop_choc', 'scoop_straw', 'scoop_pistachio', 'cherry'], from: 3, plate: 'plate', hot: false, pick: false }
  };

  var FILES = { plate: 'scene/plate', board: 'scene/board', stand: 'scene/stand', bg_kitchen: 'scene/bg_kitchen', logo: 'ui/logo' };
  Object.keys(I).forEach(function (k) { FILES[k] = 'ingredients/' + k; FILES['icon_' + k] = 'icons/icon_' + k; });

  MM.CONFIG = {
    W: 540, H: 960,
    GAME_SECONDS: 45,
    COUNTDOWN_STEP: 0.6,
    STORAGE_KEY: 'motionmenu.siparisiyetistir.v3',

    /* PUAN: yavaş yükselir. Hız bonusu: sipariş müşteri sabrı bitmeden ne kadar erken biterse o kadar yüksek. */
    SCORE: {
      correct: 1,                   // doğru malzeme
      order: 2,                     // tamamlanan sipariş
      speedMax: 4,                  // en hızlı bitirene hız bonusu (sabrın yarıdan fazlası kalmışsa tamamı)
      perfect: 2,                   // hatasız sipariş bonusu
      wrong: -3,                    // yanlış malzeme
      comboStep: 1,                 // art arda hatasız sipariş başına bonus
      comboMax: 3
    },
    /* SÜRE: hata ve müşteri kaçırma süre keser; hatasız sipariş az süre kazandırır. */
    TIME: { penalty: 10, failPenalty: 6, perfectBonus: 0.5, max: 55 },
    /* MÜŞTERİ SABRI: her siparişin kendi geri sayımı var. Bitince müşteri gider, süre ve kombo kaybedilir.
     * sabır = (base + adım sayısı * perStep) * ölçek; ölçek her siparişte `decay` kadar düşer, `min` altına inmez. */
    PATIENCE: { base: 1.8, perStep: 0.85, decay: 0.03, min: 0.72, golden: 0.85, grace: 0.5 },
    /* Butonların yeri bu siparişten sonra her seferinde karışır (ezber çalışmaz). */
    SHUFFLE_FROM: 2,
    /* Altın sipariş: puanı katlar ama sabrı kısadır. */
    GOLDEN: { chance: 0.18, from: 3, mult: 2 },
    /* ÖDÜL: bu puana ulaşan rastgele bir kupon kazanır. Kendi kampanyalarınızı buraya yazın. */
    REWARD: {
      score: 130,
      list: [
        'İçeceklerde %10 indirim',
        'Tatlılarda %15 indirim',
        'Ana yemeklerde %10 indirim',
        'Kahvede %20 indirim',
        'Çorbalarda %15 indirim',
        'Toplam hesapta %5 indirim'
      ]
    },

    LAYOUT: {
      card: { x: 30, y: 112, w: 480, h: 186 },
      plateY: 668,
      menuPlateY: 628,
      stackCX: 270
    },
    /* Zorluk: sipariş sırasına (n) göre ara malzeme sayısı. */
    ORDER: { middleCount: function (n) { return Math.min(5, 2 + Math.floor(n / 2)); } },

    INGREDIENTS: I,
    DISHES: D,

    ASSET_DIR: 'assets/img/',
    ASSET_EXT: 'png',
    TRY_ALL_FILES: false,
    AVAILABLE: {},
    ASSET_FILES: FILES
  };

  MM.Ease = {
    inQuad: function (x) { return x * x; },
    outCubic: function (x) { return 1 - Math.pow(1 - x, 3); },
    outBack: function (x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    inBack: function (x) { var c1 = 1.70158, c3 = c1 + 1; return c3 * x * x * x - c1 * x * x; },
    clamp01: function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  };
})();
