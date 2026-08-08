/* ============================================================
   SUPABASE REST API CLIENT & DATA HANDLER
   ============================================================ */
const SB_URL = 'https://frfanljillafaoekaidi.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZmFubGppbGxhZmFvZWthaWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDY5OTUsImV4cCI6MjEwMDM4Mjk5NX0.SlkkwjQtjYv9hc_5jJ4Yw8WUID6laaphardzYCfC3ig';

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

async function sbFetch(path, opts = {}) {
  const res = await fetch(SB_URL + '/rest/v1/' + path, {
    headers: {
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json',
      'Prefer': opts.prefer || 'return=representation',
      ...opts.headers
    },
    ...opts
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('json') && res.status !== 204) return res.json();
  return null;
}

async function sbGet(table, query = '') {
  return sbFetch(table + (query ? '?' + query : ''), { method: 'GET' });
}
async function sbPost(table, data) {
  return sbFetch(table, { method: 'POST', body: JSON.stringify(data), prefer: 'return=representation' });
}
async function sbPatch(table, query, data) {
  return sbFetch(table + '?' + query, { method: 'PATCH', body: JSON.stringify(data), prefer: 'return=representation' });
}
async function sbDelete(table, query) {
  return sbFetch(table + '?' + query, { method: 'DELETE', prefer: 'return=representation' });
}

// DEFAULT PRODUCTS DATA
const DEFAULT_PRODUCTS = [
  {id:'s1',nm:'Gojo Satoru (Jujutsu Kaisen)',ds:'Anime die-cut vinyl sticker',pr:15,cat:'sticker',bg:'HOT',bt:'hot',on_sale:true,img:'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'},
  {id:'s2',nm:'Chibi Nezuko (Demon Slayer)',ds:'Cute anime vinyl sticker',pr:15,cat:'sticker',bg:'CUTE',bt:'',on_sale:true,img:'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80'},
  {id:'s3',nm:'Luffy Gear 5 (One Piece)',ds:'Anime die-cut sticker',pr:15,cat:'sticker',bg:'TREND',bt:'trend',on_sale:true,img:'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80'},
  {id:'s4',nm:'Naruto Sage Mode',ds:'Anime die-cut sticker',pr:15,cat:'sticker',bg:'NEW',bt:'new',on_sale:true,img:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'},
  {id:'s5',nm:'Sailor Moon Celestial',ds:'Aesthetic anime vinyl sticker',pr:15,cat:'sticker',bg:'AESTHETIC',bt:'',on_sale:true,img:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'},
  {id:'s6',nm:'Goku Ultra Instinct',ds:'Anime die-cut sticker',pr:15,cat:'sticker',bg:'HOT',bt:'hot',on_sale:true,img:'images/unicorn_sticker_1784612754379.webp'},
  {id:'s7',nm:'Anime Waifu & Aesthetic Pack',ds:'5 Anime aesthetic stickers',pr:75,cat:'sticker',bg:'FAV',bt:'',on_sale:true,img:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'},
  {id:'s8',nm:'Demon Slayer Hashira Pack ×10',ds:'10 Anime die-cut stickers',pr:150,cat:'sticker',bg:'HOT',bt:'hot',on_sale:true,img:'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'},
  {id:'p1',nm:'Sakura Dream Poster',ds:'A5 · 148×210mm Matte Finish',pr:29,cat:'poster',bg:'A5',bt:'',on_sale:true,img:'images/sakura_poster_1784612794472.webp'},
  {id:'p2',nm:'Sunset Blaze Vaporwave Poster',ds:'A4 · 210×297mm High Gloss',pr:39,cat:'poster',bg:'HOT',bt:'hot',on_sale:true,img:'images/sunset_poster_1784612807623.webp'},
  {id:'p3',nm:'Ocean Waves Aesthetic Poster',ds:'A3 · 297×420mm Large Poster',pr:59,cat:'poster',bg:'LARGE',bt:'trend',on_sale:true,img:'images/ocean_poster_1784612823039.webp'},
  {id:'p4',nm:'Cyberpunk City Nights Poster',ds:'A3 · 297×420mm Neon Finish',pr:59,cat:'poster',bg:'NEW',bt:'new',on_sale:true,img:'images/city_poster_1784612838157.webp'},
  {id:'o1',nm:'Custom Polaroid ×1',ds:'Single retro instant print',pr:19,cat:'polaroid',bg:'CUSTOM',bt:'',on_sale:true,img:'images/polaroid_single_1784612854745.webp'},
  {id:'o2',nm:'Polaroid Pack ×5',ds:'5 custom retro prints',pr:85,cat:'polaroid',bg:'SAVE',bt:'hot',on_sale:true,img:'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'},
  {id:'o3',nm:'Polaroid Pack ×10',ds:'10 custom retro prints',pr:160,cat:'polaroid',bg:'BEST',bt:'trend',on_sale:true,img:'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80'},
  {id:'o4',nm:'Gift Set ×20',ds:'20 custom prints with fairy lights',pr:299,cat:'polaroid',bg:'GIFT',bt:'new',on_sale:true,img:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'},
  {id:'launch_offer',nm:'7 A5 Posters – Launch Offer',ds:'Any 7 A5 posters of your choice',pr:149,cat:'offer',bg:'DEAL',bt:'hot',on_sale:true,img:'images/sakura_poster_1784612794472.webp'},
  {id:'kp',nm:'K-Pop Photo Polaroids',ds:'3 custom K-Pop photocard polaroids',pr:57,cat:'polaroid',bg:'NEW',bt:'new',on_sale:true,img:'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80'},
];

let STORE_PRODUCTS = [...DEFAULT_PRODUCTS];
let STORE_CONFIG = {
  nm:'StickyPicky', wa:'919566743599', email:'stickypickyindia@gmail.com', min_order:199,
  ann:'🎉 7 A5 Posters @ ₹149 | 🔥 Anime Stickers @ ₹15',
  ofp:149, ofon:true, ston:true, rzp_key:'',
  hero:{
    img:'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=1200&auto=format&fit=crop&q=80',
    badge:'🚀 NOW OPEN FOR ORDERS!',
    title:'STICKERS & DECALS', titleSpan:'STARTING @ ₹15!',
    sub:'Laptop Stickers · Wall Decals · Posters · Custom Polaroids',
    pill:'Min Order ₹199 Only!',
    btn1Text:'Shop Stickers', btn1Link:'shop.html',
    btn2Text:'Shop Posters', btn2Link:'shop.html?cat=poster',
    overlayOpacity:50,
  }
};
const DEFAULT_BANNERS = [
  {id:'b1',img:'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=1200&auto=format&fit=crop&q=80',title:'CUTE STICKER PACKS @ ₹15',sub:'Waterproof · Scratchproof · Super Glossy Vinyl',badge:'🔥 HOT DEAL',cta:'Shop Stickers Now',cta_link:'shop.html',on_show:true},
  {id:'b2',img:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',title:'7 A5 POSTERS @ ₹149',sub:'Limited Website Launch Deal — Save ₹54!',badge:'⚡ LAUNCH OFFER',cta:'Grab Offer',cta_link:'shop.html?cat=offer',on_show:true},
  {id:'b3',img:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',title:'CUSTOM POLAROIDS & WALL DECALS',sub:'Turn your photos & aesthetic designs into prints!',badge:'✨ CUSTOM PRINTS',cta:'Explore All',cta_link:'shop.html?cat=polaroid',on_show:true},
];
let STORE_BANNERS = [...DEFAULT_BANNERS];

// LOCALSTORAGE FALLBACK CACHE LOAD
try {
  const cachedProds = localStorage.getItem('sp_local_products') || localStorage.getItem('sv_local_products');
  if (cachedProds) STORE_PRODUCTS = JSON.parse(cachedProds);
  const cachedBans = localStorage.getItem('sp_local_banners') || localStorage.getItem('sv_local_banners');
  if (cachedBans) STORE_BANNERS = JSON.parse(cachedBans);
  const cachedCfg = localStorage.getItem('sp_local_config') || localStorage.getItem('sv_local_config');
  if (cachedCfg) STORE_CONFIG = JSON.parse(cachedCfg);
} catch (e) {
  console.warn('LocalStorage cache parse error:', e);
}

async function initStoreData() {
  try {
    const prods = await sbGet('sv_products', 'order=created_at.asc');
    if (prods && prods.length) {
      STORE_PRODUCTS = prods.map(r => {
        const def = DEFAULT_PRODUCTS.find(dp => dp.id === r.id);
        return { ...r, on: r.on_sale !== undefined ? r.on_sale : true, img: r.img || (def ? def.img : '') };
      });
      try { localStorage.setItem('sp_local_products', JSON.stringify(STORE_PRODUCTS)); } catch(e){}
    }

    const bans = await sbGet('sv_banners', 'order=sort_order.asc');
    if (bans && bans.length) {
      STORE_BANNERS = bans.map((b, i) => {
        const def = DEFAULT_BANNERS.find(db => db.id === b.id) || DEFAULT_BANNERS[i];
        return { ...b, on: b.on_show !== undefined ? b.on_show : true, img: b.img || (def ? def.img : '') };
      });
      try { localStorage.setItem('sp_local_banners', JSON.stringify(STORE_BANNERS)); } catch(e){}
    }

    const cfgs = await sbGet('sv_config', 'id=eq.1');
    if (cfgs && cfgs.length) {
      STORE_CONFIG = { ...STORE_CONFIG, ...cfgs[0] };
      try { localStorage.setItem('sp_local_config', JSON.stringify(STORE_CONFIG)); } catch(e){}
    }
  } catch(e) {
    console.warn('Using fallback store data:', e);
  }

  window.STORE_PRODUCTS = STORE_PRODUCTS;
  window.STORE_CONFIG = STORE_CONFIG;
  window.STORE_BANNERS = STORE_BANNERS;

  applyStoreConfigData();
  return STORE_PRODUCTS;
}

function applyStoreConfigData() {
  if (!STORE_CONFIG) return;

  const marqueeTrack = document.querySelector('.abar .atrk');
  if (marqueeTrack && STORE_CONFIG.ann) {
    const parts = STORE_CONFIG.ann.split('|').map(s => `<span class="aitm">${escapeHTML(s.trim())}</span>`).join('');
    marqueeTrack.innerHTML = parts + parts;
  }

  const storeName = STORE_CONFIG.nm || 'StickyPicky';
  document.querySelectorAll('.logo, .flogo').forEach(el => {
    el.textContent = storeName;
  });
  document.title = storeName + ' — Anime Stickers, Posters & Polaroids';

  if (STORE_CONFIG.wa) {
    const waClean = STORE_CONFIG.wa.replace(/[\s\-\+]/g, '');
    document.querySelectorAll('.wabtn, a[href*="wa.me"]:not([id="PAY_OPT_WA"]):not(.pay-btn)').forEach(el => {
      el.href = `https://wa.me/${waClean}?text=Hi!%20I%20want%20to%20order%20from%20${encodeURIComponent(STORE_CONFIG.nm || 'StickyPicky')}!`;
    });
  }

  if (STORE_CONFIG.min_order) {
    const minL = document.getElementById('MINL');
    if (minL) minL.textContent = STORE_CONFIG.min_order;
  }

  // Update Launch Offer Card dynamically
  const offTitle = document.getElementById('OFFER_TITLE');
  const offPrice = document.getElementById('OFFER_PRICE');
  const offOrigPrice = document.getElementById('OFFER_ORIG_PRICE');
  const offBtn = document.getElementById('OFFER_BTN');

  const dealPrice = STORE_CONFIG.ofp || 149;
  const dealTitle = STORE_CONFIG.of_title || '7 A5 POSTERS BUNDLE';
  const origPrice = STORE_CONFIG.of_orig || 203;

  if (offTitle) offTitle.textContent = dealTitle;
  if (offPrice) offPrice.textContent = '₹' + dealPrice + ' ONLY';
  if (offOrigPrice) offOrigPrice.textContent = 'Original Price: ₹' + origPrice;
  if (offBtn) offBtn.textContent = '🛍️ CUSTOMIZE & ADD BUNDLE TO CART — ₹' + dealPrice;

  // Update Category Card min prices dynamically from STORE_PRODUCTS
  if (window.STORE_PRODUCTS && window.STORE_PRODUCTS.length) {
    const catPrices = {};
    window.STORE_PRODUCTS.forEach(p => {
      if (!catPrices[p.cat] || p.pr < catPrices[p.cat]) {
        catPrices[p.cat] = p.pr;
      }
    });
    document.querySelectorAll('.ccard').forEach(card => {
      const href = card.getAttribute('href') || '';
      const match = href.match(/cat=([a-z0-9_]+)/i);
      const cat = match ? match[1] : '';
      const prEl = card.querySelector('.cpr');
      if (cat && catPrices[cat] !== undefined && prEl) {
        if (cat === 'offer') prEl.textContent = '7 for ₹' + dealPrice;
        else if (cat === 'polaroid') prEl.textContent = '₹' + catPrices[cat] + ' each';
        else prEl.textContent = 'From ₹' + catPrices[cat];
      }
    });
  }
}

window.addEventListener('storage', (e) => {
  if (['sp_local_products', 'sv_local_products', 'sp_local_banners', 'sv_local_banners', 'sp_local_config', 'sv_local_config'].includes(e.key)) {
    try {
      const p = localStorage.getItem('sp_local_products') || localStorage.getItem('sv_local_products');
      if (p) {
        STORE_PRODUCTS = JSON.parse(p);
        window.STORE_PRODUCTS = STORE_PRODUCTS;
      }
      const c = localStorage.getItem('sp_local_config') || localStorage.getItem('sv_local_config');
      if (c) {
        STORE_CONFIG = JSON.parse(c);
        window.STORE_CONFIG = STORE_CONFIG;
      }
      const b = localStorage.getItem('sp_local_banners') || localStorage.getItem('sv_local_banners');
      if (b) {
        STORE_BANNERS = JSON.parse(b);
        window.STORE_BANNERS = STORE_BANNERS;
      }
      applyStoreConfigData();
      if (typeof renderShopProducts === 'function') renderShopProducts();
      if (typeof renderFeaturedProducts === 'function') renderFeaturedProducts();
      if (typeof renderBanners === 'function') renderBanners();
    } catch(err) {
      console.warn('Realtime tab sync error:', err);
    }
  }
});

window.escapeHTML = escapeHTML;
window.applyStoreConfigData = applyStoreConfigData;
window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
window.DEFAULT_BANNERS = DEFAULT_BANNERS;
window.STORE_PRODUCTS = STORE_PRODUCTS;
window.STORE_CONFIG = STORE_CONFIG;
window.STORE_BANNERS = STORE_BANNERS;



