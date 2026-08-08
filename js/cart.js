/* ============================================================
   GLOBAL SHOPPING CART & NOTIFICATIONS STATE MANAGER
   ============================================================ */
let CART = [];
try {
  const c = localStorage.getItem('sp_cart') || localStorage.getItem('sv_cart');
  if (c) CART = JSON.parse(c);
} catch(e) {
  console.warn('Cart load warning:', e);
}

function safeHTML(str) {
  return typeof window.escapeHTML === 'function' ? window.escapeHTML(str) : String(str || '').replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]; });
}

function saveCartToStorage() {
  window.CART = CART;
  try {
    localStorage.setItem('sp_cart', JSON.stringify(CART));
    localStorage.setItem('sv_cart', JSON.stringify(CART));
  } catch (e) {
    console.warn('LocalStorage quota exceeded or disabled, keeping cart in memory:', e);
  }
  renderCartUI();
}

function addToCart(pId, qty = 1, options = null) {
  const numQty = parseInt(qty) || 1;
  let allProds = (window.STORE_PRODUCTS && window.STORE_PRODUCTS.length) ? window.STORE_PRODUCTS : (window.DEFAULT_PRODUCTS || []);
  
  try {
    const cached = localStorage.getItem('sp_local_products') || localStorage.getItem('sv_local_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.length) allProds = parsed;
    }
  } catch(e){}

  const p = allProds.find(x => x.id === pId) || (window.DEFAULT_PRODUCTS || []).find(x => x.id === pId);
  if (!p) {
    showToast('Product not found!');
    return;
  }

  let title = p.nm;
  if (options && options.selectedPosters && options.selectedPosters.length) {
    title += ' (Posters: ' + options.selectedPosters.join(', ') + ')';
  }

  const itemId = options ? (pId + '_' + Date.now()) : pId;
  const existing = !options ? CART.find(x => x.id === pId || x.rawId === pId) : null;
  
  if (existing) {
    existing.q += numQty;
  } else {
    const itemImg = (p.img && p.img.length > 500) ? p.img.slice(0, 500) : (p.img || '');
    CART.push({ id: itemId, rawId: p.id, nm: title, pr: p.pr, img: itemImg, q: numQty, options: options });
  }
  saveCartToStorage();
  const currentTotalQty = existing ? existing.q : numQty;
  showToast('✅ Added to Cart! (Total in cart: ' + currentTotalQty + ')');
}

function updateCartQty(pId, delta) {
  const idx = CART.findIndex(x => x.id === pId);
  if (idx < 0) return;
  CART[idx].q += delta;
  if (CART[idx].q <= 0) {
    CART.splice(idx, 1);
  }
  saveCartToStorage();
}

function clearCart() {
  CART = [];
  saveCartToStorage();
}

function getCartTotal() {
  return CART.reduce((sum, item) => sum + item.pr * item.q, 0);
}

function getCartCount() {
  return CART.reduce((sum, item) => sum + item.q, 0);
}

function showToast(msg) {
  let toastEl = document.getElementById('TST');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'TST';
    toastEl.className = 'tst';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add('on');
  setTimeout(() => toastEl.classList.remove('on'), 2500);
}

function openCartDrawer() {
  const drawer = document.getElementById('CPANEL');
  const bg = document.getElementById('CBG');
  if (drawer) drawer.classList.add('on');
  if (bg) bg.classList.add('on');
}

function closeCartDrawer() {
  const drawer = document.getElementById('CPANEL');
  const bg = document.getElementById('CBG');
  if (drawer) drawer.classList.remove('on');
  if (bg) bg.classList.remove('on');
}

function renderCartUI() {
  const cnt = getCartCount();
  const tot = getCartTotal();

  // Update navbar badge
  const cnum = document.getElementById('CNUM');
  if (cnum) cnum.textContent = cnt;

  // Update sticky cart bar
  const scar = document.getElementById('SCAR');
  const scpr = document.getElementById('SCPR');
  const scit = document.getElementById('SCIT');
  if (scar) scar.classList.toggle('on', cnt > 0);
  if (scpr) scpr.textContent = '₹' + tot;
  if (scit) scit.textContent = cnt + ' item' + (cnt !== 1 ? 's' : '');

  // Update drawer UI
  const cpTot = document.getElementById('CPTOT');
  if (cpTot) cpTot.textContent = '₹' + tot;

  const min = (window.STORE_CONFIG && window.STORE_CONFIG.min_order) ? window.STORE_CONFIG.min_order : 199;
  const minLeft = Math.max(0, min - tot);
  const minNote = document.getElementById('MINNOTE');
  const minL = document.getElementById('MINL');
  if (minL) minL.textContent = minLeft;
  if (minNote) minNote.style.display = (minLeft > 0 && cnt > 0) ? 'block' : 'none';

  const cpItems = document.getElementById('CPITEMS');
  if (cpItems) {
    if (!CART.length) {
      cpItems.innerHTML = '<div style="text-align:center;padding:48px 16px;"><div style="font-size:48px">🛒</div><p style="font-size:14px;font-weight:800;color:#aaa;margin-top:12px">Your cart is empty!<br>Add some cool stickers</p></div>';
    } else {
      cpItems.innerHTML = CART.map(item => `
        <div class="cpitem">
          <div class="cpth">${item.img ? `<img src="${safeHTML(item.img)}" alt="${safeHTML(item.nm)}">` : `<div style="background:#eee;width:100%;height:100%;display:flex;align-items:center;justify-content:center">🛍️</div>`}</div>
          <div style="flex:1">
            <div class="cpnm">${safeHTML(item.nm)}</div>
            <div class="cppr">₹${item.pr * item.q}</div>
            <div class="cpqty">
              <button class="qbtn" onclick="updateCartQty('${safeHTML(item.id)}', -1)">−</button>
              <span style="font-weight:900;font-size:13px">${item.q}</span>
              <button class="qbtn" onclick="updateCartQty('${safeHTML(item.id)}', 1)">+</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

function toggleMobileMenu() {
  const nav = document.querySelector('.nav-links');
  if (nav) nav.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartUI();
});

