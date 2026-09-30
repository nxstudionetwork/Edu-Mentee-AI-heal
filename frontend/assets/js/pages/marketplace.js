window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var router = window.Router;
  var api = window.API;
  var utils = window.Utils;
  var mockData = window.mockData;

  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-action^="marketplace:"]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var parts = action.split(':');
    var cmd = parts[1];
    var arg = parts[2];
    var arg2 = parts[3];
    if (cmd === 'addToCart' && arg) { e.stopPropagation(); window.renderPage.addToCart(arg); }
    if (cmd === 'toggleWishlist' && arg) { e.stopPropagation(); window.renderPage.toggleWishlist(arg); }
    if (cmd === 'openProductDrawer' && arg) { e.stopPropagation(); window.renderPage.openProductDrawer(arg); }
    if (cmd === 'removeFromCart' && arg) { e.stopPropagation(); window.renderPage.removeFromCart(arg); }
    if (cmd === 'applyCoupon') { e.stopPropagation(); window.renderPage.applyCoupon(); }
    if (cmd === 'removeCoupon') { e.stopPropagation(); window.renderPage.removeCoupon(); }
    if (cmd === 'checkout') { e.stopPropagation(); window.renderPage.checkout(); }
    if (cmd === 'proceedToPayment') { window.renderPage.proceedToPayment(); }
    if (cmd === 'placeOrder') { window.renderPage.placeOrder(); }
    if (cmd === 'closeProductDrawer') { window.renderPage.closeProductDrawer(); }
    if (cmd === 'openReviewModal') { window.renderPage.openReviewModal(); }
    if (cmd === 'submitReview') { window.renderPage.submitReview(); }
    if (cmd === 'showCompareTable') { window.renderPage.showCompareTable(); }
    if (cmd === 'clearFilters') { window.renderPage.clearFilters(); }
    if (cmd === 'goToPage' && arg) { window.renderPage.goToPage(parseInt(arg)); }
    if (cmd === 'subscribeToPlan' && arg) { window.renderPage.subscribeToPlan(arg); }
    if (cmd === 'showInvoice' && arg) { window.renderPage.showInvoice(arg); }
    if (cmd === 'trackOrder' && arg) { e.stopPropagation(); window.renderPage.trackOrder(arg); }
    if (cmd === 'previewStars' && arg) { window.renderPage.previewStars(parseInt(arg)); }
    if (cmd === 'setReviewRating' && arg) { window.renderPage.setReviewRating(parseInt(arg)); }
    if (cmd === 'switchGalleryImage' && arg) { window.renderPage.switchGalleryImage(parseInt(arg)); }
    if (cmd === 'selectPayment' && arg) { window.renderPage.selectPayment(arg); }
    if (cmd === 'checkoutStep' && arg) { window.renderPage.checkoutStep(arg); }
    if (cmd === 'navigate' && arg) { if (arg === 'back') { window.history.back(); } else { location.hash = '#' + arg; } }
    if (cmd === 'setCategoryPill' && arg) { filterState.categoryPill = arg; filterState.page = 1; window.renderPage.marketplace(router.getParams()); }
    if (cmd === 'removeFilterChip' && arg) { window.renderPage.removeFilterChip(arg, arg2 || undefined); }
    if (cmd === 'updateFilter' && arg) { var val = target.tagName === 'INPUT' || target.tagName === 'SELECT' ? target.value : arg2; window.renderPage.updateFilter(arg, val); }
    if (cmd === 'toggleCompare' && arg) { var chk = target.querySelector('input[type="checkbox"]'); window.renderPage.toggleCompare(arg, chk ? chk.checked : false); }
    if (cmd === 'switchView' && arg) { filterState.view = arg; window.renderPage.marketplace(router.getParams()); }
    if (cmd === 'clearCompare') { store.set('compareItems', []); var pages = document.querySelectorAll('.compare-checkbox'); for (var p = 0; p < pages.length; p++) { pages[p].checked = false; } renderCompareBar(); }
    if (cmd === 'helpful') { var c = target.querySelector('.helpful-count'); if (c) { c.textContent = parseInt(c.textContent) + 1; target.disabled = true; target.style.opacity = '0.5'; } }
    if (cmd === 'closeModal') { var modal = target.closest('.modal-overlay'); if (modal) modal.remove(); }
    if (cmd === 'clearWishlist') { store.set('wishlist',[]); window.renderPage.marketplace({wishlist:1}); showToast('Wishlist cleared','info'); }
    if (cmd === 'copyCoupon' && arg) { window.renderPage.copyCoupon(arg, target); }
    if (cmd === 'updateCartQty' && arg && arg2) { window.renderPage.updateCartQty(arg, parseInt(arg2)); }
    if (cmd === 'buyNow' && arg) { window.renderPage.addToCart(arg); window.renderPage.closeProductDrawer(); setTimeout(function(){window.renderPage.checkoutStep('shipping');},300); }
    if (cmd === 'storeSet' && arg && arg2) { var storeArg = arg2; try { storeArg = JSON.parse(arg2); } catch(e) {} store.set(arg, storeArg); if (parts[4]) { window.renderPage.marketplace(JSON.parse(parts[4])); } }
    if (cmd === 'rerender' && arg) { try { window.renderPage.marketplace(JSON.parse(arg)); } catch(e) { window.renderPage.marketplace(); } }
    if (cmd === 'openFilterDrawer') { e.stopPropagation(); openFilterDrawer(); }
    if (cmd === 'showToast' && arg) { e.stopPropagation(); showToast(arg, parts[3] || 'success'); }
    if (cmd === 'searchKeydown' && arg) { window.renderPage.updateFilter(arg, target.value); }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var t = e.target.closest('[data-action-onenter^="marketplace:"]');
      if (!t) return;
      var a = t.getAttribute('data-action-onenter');
      var p = a.split(':');
      if (p[1] === 'updateFilter' && p[2]) { window.renderPage.updateFilter(p[2], t.value); }
    }
  });
  document.addEventListener('change', function(e) {
    var t = e.target.closest('[data-action-onchange^="marketplace:"]');
    if (!t) return;
    var a = t.getAttribute('data-action-onchange');
    var p = a.split(':');
    var cmd = p[1], arg = p[2];
    if (cmd === 'updateFilter' && arg) { window.renderPage.updateFilter(arg, t.value); }
    if (cmd === 'selectPayment' && arg) { window.renderPage.selectPayment(arg); }
    if (cmd === 'categoryNavigate') { location.hash = '#/marketplace/category/' + arg + '?sort=' + t.value; }
  });
  document.addEventListener('mouseover', function(e) {
    var t = e.target.closest('[data-action-hover^="marketplace:"]');
    if (!t) return;
    var a = t.getAttribute('data-action-hover');
    var p = a.split(':');
    if (p[1] === 'previewStars' && p[2]) { window.renderPage.previewStars(parseInt(p[2])); }
  });

  var PAGE_SIZE = 12;
  var CATEGORIES = [
    { slug: 'books', name: 'Books', icon: '\u0040\u0040ICON_BOOKS\u0040\u0040' },
    { slug: 'stationery', name: 'Stationery', icon: '\u0040\u0040ICON_STATIONERY\u0040\u0040' },
    { slug: 'notes', name: 'Premium Notes', icon: '\u0040\u0040ICON_NOTES\u0040\u0040' },
    { slug: 'courses', name: 'Courses', icon: '\u0040\u0040ICON_COURSES\u0040\u0040' },
    { slug: 'mock-tests', name: 'Mock Test Packs', icon: '\u0040\u0040ICON_MOCKTESTS\u0040\u0040' },
    { slug: 'exam-bundles', name: 'Exam Bundles', icon: '\u0040\u0040ICON_EXAMBUNDLES\u0040\u0040' },
    { slug: 'practice-books', name: 'Practice Books', icon: '\u0040\u0040ICON_PRACTICEBOOKS\u0040\u0040' },
    { slug: 'accessories', name: 'Accessories', icon: '\u0040\u0040ICON_ACCESSORIES\u0040\u0040' }
  ];

  var BANNER_DEALS = [
    { title: 'Summer Sale', subtitle: 'Up to 40% off on all exam bundles', color: 'var(--accent-blue)', bg: 'var(--gradient-primary)', emoji: '\u0040\u0040EMOJI_SUN\u0040\u0040' },
    { title: 'New Arrivals', subtitle: 'Check out the latest study materials', color: 'var(--accent-purple)', bg: 'var(--gradient-secondary)', emoji: '\u0040\u0040EMOJI_NEW\u0040\u0040' },
    { title: 'Combo Offers', subtitle: 'Buy 2 Get 1 Free on selected items', color: 'var(--accent-green)', bg: 'var(--gradient-green)', emoji: '\u0040\u0040EMOJI_TARGET\u0040\u0040' }
  ];

  var CATEGORY_PILLS = [
    { id: 'all', label: 'All', icon: '\u0040\u0040EMOJI_ALL\u0040\u0040' },
    { id: 'books', label: 'Textbooks', icon: '\u0040\u0040ICON_BOOKS\u0040\u0040' },
    { id: 'stationery', label: 'Stationery', icon: '\u0040\u0040ICON_STATIONERY\u0040\u0040' },
    { id: 'notes', label: 'Premium Notes', icon: '\u0040\u0040ICON_NOTES\u0040\u0040' },
    { id: 'courses', label: 'Courses', icon: '\u0040\u0040ICON_COURSES\u0040\u0040' },
    { id: 'mock-tests', label: 'Mock Tests', icon: '\u0040\u0040ICON_MOCKTESTS\u0040\u0040' },
    { id: 'exam-bundles', label: 'Bundles', icon: '\u0040\u0040ICON_EXAMBUNDLES\u0040\u0040' },
    { id: 'practice-books', label: 'Practice Books', icon: '\u0040\u0040ICON_PRACTICEBOOKS\u0040\u0040' },
    { id: 'accessories', label: 'Accessories', icon: '\u0040\u0040ICON_ACCESSORIES\u0040\u0040' },
    { id: 'electronics', label: 'Electronics', icon: '\u0040\u0040EMOJI_ELECTRONICS\u0040\u0040' }
  ];

  var CATEGORY_NAV = [
    { id: 'all', label: 'All' },
    { id: 'books', label: 'Books' },
    { id: 'stationery', label: 'Stationery' },
    { id: 'courses', label: 'Courses' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'notes', label: 'Notes' },
    { id: 'practice-books', label: 'Practice Books' },
    { id: 'mock-tests', label: 'Mock Tests' }
  ];

  function renderCategoryPills() {
    var current = filterState.categoryPill || 'all';
    var html = '<div class="c-flex" style="gap:var(--space-2);overflow-x:auto;padding-bottom:var(--space-2);margin-bottom:var(--space-4);flex-wrap:nowrap;scroll-snap-type:x mandatory">';
    for (var i = 0; i < CATEGORY_PILLS.length; i++) {
      var pill = CATEGORY_PILLS[i];
      var active = current === pill.id;
      html += '<button class="btn ' + (active ? 'btn-primary' : 'btn-ghost') + ' btn-sm c-nowrap c-pointer" style="flex-shrink:0;scroll-snap-align:start;border-radius:20px;padding:4px 14px" data-action="marketplace:setCategoryPill:' + pill.id + '">' + pill.icon + ' ' + pill.label + '</button>';
    }
    html += '</div>';
    return html;
  }

  var filterState = {
    search: '',
    categories: [],
    priceMin: '',
    priceMax: '',
    rating: '',
    condition: [],
    soldBy: [],
    sort: '',
    view: 'marketplace',
    page: 1,
    categoryPill: 'all'
  };

  var SECTION_TABS = [
    { id: 'deals', label: "Today's Deals", icon: '\u0040\u0040EMOJI_FIRE\u0040\u0040' },
    { id: 'marketplace', label: 'Marketplace', icon: '\u0040\u0040EMOJI_STORE\u0040\u0040' },
    { id: 'bestsellers', label: 'Best Sellers', icon: '\u0040\u0040EMOJI_STAR\u0040\u0040' },
    { id: 'newarrivals', label: 'New Arrivals', icon: '\u0040\u0040EMOJI_NEW2\u0040\u0040' },
    { id: 'compare', label: 'Compare Products', icon: '\u0040\u0040EMOJI_CHART\u0040\u0040' }
  ];

  function getCartCount() {
    var cart = store.get('cart') || [];
    return cart.length;
  }

  function getWishlist() {
    return store.get('wishlist') || [];
  }

  function isInWishlist(id) {
    var wl = getWishlist();
    for (var i = 0; i < wl.length; i++) {
      if (wl[i].id === id) return true;
    }
    return false;
  }

  function toggleWishlist(item) {
    var wl = getWishlist();
    var idx = -1;
    for (var i = 0; i < wl.length; i++) {
      if (wl[i].id === item.id) { idx = i; break; }
    }
    if (idx > -1) {
      wl.splice(idx, 1);
      showToast('Removed from wishlist', 'info');
    } else {
      wl.push(item);
      showToast('Added to wishlist!', 'success');
    }
    store.set('wishlist', wl);
    if (window.location.hash.indexOf('wishlist') !== -1) {
      window.renderPage.marketplace({ wishlist: 1 });
    }
  }

  function showToast(message, type) {
    if (!type) type = 'info';
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    var icons = { success: '\u2713', error: '\u2715', info: '\u2139', warning: '\u26A0' };
    toast.innerHTML = '<span>' + (icons[type] || '\u2139') + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  function renderStars(rating) {
    var html = '<div class="rating">';
    var full = Math.floor(rating);
    var half = rating - full >= 0.5;
    for (var i = 0; i < 5; i++) {
      if (i < full) {
        html += '<span class="star">\u2605</span>';
      } else if (i === full && half) {
        html += '<span class="star">\u2605</span>';
      } else {
        html += '<span class="star star-empty">\u2605</span>';
      }
    }
    html += '</div>';
    return html;
  }

  function countCategoryItems(slug) {
    var items = mockData.marketplace || [];
    var count = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].category === slug) count++;
    }
    return count;
  }

  function getCategoryName(slug) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].slug === slug) return CATEGORIES[i].name;
    }
    return slug;
  }
  function renderProductCard(item, options) {
    options = options || {};
    var discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
    var inWish = isInWishlist(item.id);
    var gradient = utils.getGradient(parseInt(item.id.slice(1)) || 0);
    var emojis = { books: '\u0040\u0040EMOJI_BOOK', stationery: '\u0040\u0040EMOJI_PEN', notes: '\u0040\u0040EMOJI_NOTE', courses: '\u0040\u0040EMOJI_GRAD', 'mock-tests': '\u0040\u0040EMOJI_CLIP', 'exam-bundles': '\u0040\u0040EMOJI_PACK', 'practice-books': '\u0040\u0040EMOJI_BOOK2', accessories: '\u0040\u0040EMOJI_HEADPH', electronics: '\u0040\u0040EMOJI_LAPTOP' };
    var emoji = emojis[item.category] || '\u0040\u0040EMOJI_PACK';
    var isBestSeller = options.isBestSeller || (item.rating >= 4.5 && item.reviews >= 100);
    var freeDelivery = item.price >= 500;
    var compareItems = store.get('compareItems') || [];
    var inCompare = false;
    for (var ci = 0; ci < compareItems.length; ci++) {
      if (compareItems[ci] === item.id) { inCompare = true; break; }
    }
    var isTrending = options.isTrending || false;
    var badgeHtml = '<div class="c-absolute c-flex" style="top:var(--space-2);left:var(--space-2);flex-direction:column;gap:3px;z-index:5">';
    if (isTrending) badgeHtml += '<div class="badge c-bg-warning c-text-primary c-fs-xs" style="padding:2px 7px">\u0040\u0040EMOJI_FIRE Trending</div>';
    if (discount > 0) badgeHtml += '<div class="badge badge-red c-fs-xs" style="padding:2px 7px">-' + discount + '%</div>';
    if (isBestSeller) badgeHtml += '<div class="badge c-bg-accent c-text-primary c-fs-xs" style="padding:2px 7px">Best Seller</div>';
    if (options.isNew) badgeHtml += '<div class="badge c-bg-accent c-text-primary c-fs-xs" style="padding:2px 7px">NEW</div>';
    if (freeDelivery) badgeHtml += '<div class="badge c-bg-success c-text-primary c-fs-xs" style="padding:2px 7px">Free Delivery</div>';
    if (options.isDeal) badgeHtml += '<div class="badge c-bg-warning c-text-primary c-fs-xs" style="padding:2px 7px">\u0040\u0040EMOJI_FIRE Deal</div>';
    if (!item.inStock) badgeHtml += '<div class="badge badge-red c-fs-xs" style="padding:2px 7px">Out of Stock</div>';
    badgeHtml += '</div>';
    var wishlistIcon = inWish ? '\u0040\u0040EMOJI_HEART_FILLED' : '\u0040\u0040EMOJI_HEART_EMPTY';
    var imgPlaceholder = '\
  <div class="product-image" style="background:' + gradient + '">\
    <span class="c-fs-lg" style="font-size:3rem">' + emoji + '</span>\
    ' + badgeHtml + '\
  </div>';
    var wishlistBtn = '\
  <button class="wishlist-heart-btn c-absolute c-flex-center c-pointer c-transition" data-action="marketplace:toggleWishlist:' + item.id + '" title="' + (inWish ? 'Remove from wishlist' : 'Add to wishlist') + '" style="top:var(--space-2);right:var(--space-2);z-index:6;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;font-size:var(--text-base);color:' + (inWish ? 'var(--accent-red)' : '#999') + ';box-shadow:0 2px 6px rgba(0,0,0,0.1);line-height:1">\
      ' + wishlistIcon + '\
  </button>';
    return '\
<div class="product-card c-relative c-flex c-flex-col c-overflow-hidden" data-action="marketplace:openProductDrawer:' + item.id + '" style="cursor:pointer;border-radius:var(--radius-lg);background:var(--bg-secondary);border:1px solid var(--border-color);transition:all 0.2s">\
  <div style="position:relative">' + imgPlaceholder + wishlistBtn + '\
  </div>\
  <div class="product-body c-p-3 c-flex c-flex-col" style="flex:1">\
    <div class="c-fs-xs c-text-secondary c-mb-1" style="letter-spacing:0.3px">' + utils.sanitizeHTML(getCategoryName(item.category)) + ' | ID: ' + item.id + '</div>\
    <div class="product-title c-fw-semibold c-fs-sm c-mb-1 c-text-primary" style="line-height:1.3">' + utils.sanitizeHTML(utils.truncate(item.title, 45)) + '</div>\
    <div class="c-flex c-flex-gap-1 c-mb-1 c-flex-center-h" style="align-items:center">\
      ' + renderStars(item.rating) + '\
      <span class="c-fs-xs c-text-secondary c-ml-1">' + item.rating + ' (' + utils.formatNumber(item.reviews) + ')</span>\
    </div>\
    <div class="c-flex c-flex-gap-2 c-mb-2" style="align-items:baseline">\
      <span class="price c-fs-lg c-fw-bold" style="color:var(--accent-blue)">' + utils.formatCurrency(item.price) + '</span>\
      ' + (item.originalPrice > item.price ? '<span class="price-original c-fs-xs c-text-secondary" style="text-decoration:line-through">' + utils.formatCurrency(item.originalPrice) + '</span>' : '') + '\
      ' + (discount > 0 ? '<span class="c-fs-xs c-fw-semibold" style="color:var(--accent-green)">' + discount + '% off</span>' : '') + '\
    </div>\
    <div class="c-flex c-flex-gap-2 c-fs-xs c-text-secondary c-mb-2">\
      <span class="badge ' + (item.inStock ? 'badge-green' : 'badge-red') + '" style="font-size:9px;padding:1px 5px">' + (item.inStock ? 'In Stock' : 'Out of Stock') + '</span>\
      ' + (freeDelivery ? '<span class="c-text-success c-fw-semibold">\u0040\u0040EMOJI_DELIVERY Free</span>' : '<span>\u0040\u0040EMOJI_DELIVERY ₹40 shipping</span>') + '\
      ' + (item.seller ? '<span>by ' + utils.sanitizeHTML(utils.truncate(item.seller, 14)) + '</span>' : '') + '\
    </div>\
    <div class="product-footer c-flex c-flex-gap-2 c-mt-auto c-pt-2" style="border-top:1px solid var(--border-color)">\
      <button class="btn btn-primary btn-sm c-flex-1 add-cart-btn c-fs-sm" data-action="marketplace:addToCart:' + item.id + '" ' + (!item.inStock ? 'disabled' : '') + '>\u0040\u0040EMOJI_CART Add to Cart</button>\
      <label class="compare-label c-fs-xs c-pointer c-flex c-flex-gap-1 c-text-secondary c-nowrap c-ml-1" style="user-select:none;align-items:center" data-action="marketplace:toggleCompare:' + item.id + '">\
        <input type="checkbox" class="compare-checkbox" ' + (inCompare ? 'checked' : '') + ' style="cursor:pointer;margin:0;width:12px;height:12px">\
        <span style="font-size:9px">Compare</span>\
      </label>\
    </div>\
  </div>\
</div>';
  }

  function renderProductCards(items, start, end) {
    var page = items.slice(start, end);
    var html = '';
    for (var i = 0; i < page.length; i++) {
      html += renderProductCard(page[i]);
    }
    return html;
  }

  function renderPagination(total, page, pageSize) {
    var totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return '';
    var html = '<div class="pagination">';
    html += '<button class="page-btn" data-action="marketplace:goToPage:' + (page - 1) + '" ' + (page <= 1 ? 'disabled' : '') + '>\u2039</button>';
    var startPage = Math.max(1, page - 2);
    var endPage = Math.min(totalPages, page + 2);
    if (startPage > 1) {
      html += '<button class="page-btn" data-action="marketplace:goToPage:1">1</button>';
      if (startPage > 2) html += '<span class="page-btn c-pointer">\u2026</span>';
    }
    for (var i = startPage; i <= endPage; i++) {
      html += '<button class="page-btn' + (i === page ? ' active' : '') + '" data-action="marketplace:goToPage:' + i + '">' + i + '</button>';
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += '<span class="page-btn c-pointer">\u2026</span>';
      html += '<button class="page-btn" data-action="marketplace:goToPage:' + totalPages + '">' + totalPages + '</button>';
    }
    html += '<button class="page-btn" data-action="marketplace:goToPage:' + (page + 1) + '" ' + (page >= totalPages ? 'disabled' : '') + '>\u203A</button>';
    html += '</div>';
    return html;
  }

  function getWishlistCount() {
    var wl = getWishlist();
    return wl.length;
  }

  function isDigitalProduct(cat) {
    var digitalCats = ['courses', 'premium-notes', 'programming', 'languages', 'mock-tests', 'exam-bundles', 'notes'];
    for (var i = 0; i < digitalCats.length; i++) {
      if (cat === digitalCats[i]) return true;
    }
    return false;
  }

  function getOrders() {
    return store.get('orders') || [];
  }

  function generateMockOrders() {
    var existing = store.get('orders');
    if (existing && existing.length > 0) return existing;
    var cart = store.get('cart') || [];
    var mp = mockData.marketplace || [];
    var statuses = ['delivered', 'processing', 'cancelled'];
    var orders = [];
    for (var i = 0; i < 5; i++) {
      var numItems = Math.floor(Math.random() * 3) + 1;
      var items = [];
      for (var j = 0; j < numItems; j++) {
        var mi = mp[Math.floor(Math.random() * mp.length)] || { id:'m0', title:'Study Item', price:299, quantity:1 };
        items.push({ id: mi.id, title: mi.title, price: mi.price, quantity: Math.floor(Math.random() * 3) + 1 });
      }
      var subtotal = 0;
      for (var k = 0; k < items.length; k++) {
        subtotal += items[k].price * items[k].quantity;
      }
      var discount = Math.random() > 0.5 ? Math.round(subtotal * (Math.floor(Math.random() * 20) + 5) / 100) : 0;
      var tax = Math.round(subtotal * 0.18);
      var total = subtotal - discount + tax;
      var d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * 90) - 1);
      var st = statuses[Math.floor(Math.random() * statuses.length)];
      orders.push({
        id: 'ORD' + (10000 + i),
        date: d.toISOString().split('T')[0],
        items: items,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total,
        status: st,
        billing: {
          name: 'Student User',
          address: '123 Education Lane, Learning City',
          email: 'student@edumentee.com',
          phone: '+91 98765 43210'
        }
      });
    }
    store.set('orders', orders);
    return orders;
  }

  function renderSubscriptionCard(plan, index) {
    var user = store.get('user') || {};
    var currentPlan = user.plan || 'free';
    var isCurrent = currentPlan === plan.badge;
    var popularStyle = plan.isPopular ? 'border:2px solid var(--accent-gold);transform:scale(1.02)' : '';
    var html = '\
<div class="stat-card c-text-center c-relative" style="padding:var(--space-6);' + popularStyle + '">\
  ' + (plan.isPopular ? '<div class="badge badge-gold c-absolute c-bg-accent c-text-primary c-fw-bold" style="top:-10px;right:var(--space-4);">POPULAR</div>' : '') + '\
  <div class="c-fs-xl c-mb-3" style="font-size:2rem">' + (plan.price === 0 ? 'u{1F193}' : plan.duration >= 12 ? 'u{1F31F}' : 'u{1F31F}2') + '</div>\
  <div class="c-fs-xl c-fw-bold c-mb-2">' + plan.name + '</div>\
  <div class="c-text-accent c-mb-3" style="font-size:var(--text-3xl);font-weight:800">' + (plan.price === 0 ? 'Free' : '₹' + plan.price + (plan.duration > 0 ? (plan.duration >= 12 ? '/year' : '/month') : '')) + '</div>\
  <div class="c-flex" style="flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-5);text-align:left;padding:0 var(--space-2)">';
    for (var f = 0; f < plan.features.length; f++) {
      html += '\
    <div class="c-flex c-flex-gap-2 c-fs-sm"><span class="c-text-success">\u2713</span><span>' + plan.features[f] + '</span></div>';
    }
    html += '\
  </div>\
  ' + (isCurrent ? '<div class="badge badge-green c-fs-base" style="padding:0.5rem 1.5rem">Current Plan \u2713</div>' : '<button class="btn btn-primary c-w-full" data-action="marketplace:subscribeToPlan:' + plan.id + '">Subscribe</button>') + '\
</div>';
    return html;
  }

  function renderPremiumSection() {
    var subs = mockData.subscriptions || [];
    var html = '\
  <div class="section-header c-mt-8">\
    <h2 class="section-title">Premium Membership</h2>\
    <span class="section-action">View All Plans \u2192</span>\
  </div>\
  <div class="c-grid c-mb-8" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-4)">';
    for (var i = 0; i < subs.length; i++) {
      html += renderSubscriptionCard(subs[i], i);
    }
    html += '\
  </div>';
    return html;
  }

  function renderRecommendations() {
    var user = store.get('user') || {};
    var userClass = user.class || 10;
    var mp = mockData.marketplace || [];
    var subjectCats = ['books', 'courses', 'premium-notes', 'practice-books', 'mock-tests', 'exam-bundles'];
    var matched = [];
    for (var i = 0; i < mp.length; i++) {
      for (var j = 0; j < subjectCats.length; j++) {
        if (mp[i].category === subjectCats[j]) {
          matched.push(mp[i]);
          break;
        }
      }
    }
    var shuffled = utils.shuffleArray(matched);
    var recs = shuffled.slice(0, 4);
    var html = '\
  <div class="section-header">\
    <h2 class="section-title">Recommended for You</h2>\
    <span class="section-action">View All \u2192</span>\
  </div>\
  <div class="c-flex c-flex-gap-3 c-overflow-auto c-mb-8" style="gap:var(--space-4);padding-bottom:var(--space-4);scroll-snap-type:x mandatory">';
    for (var r = 0; r < recs.length; r++) {
      html += '<div class="c-pointer" style="min-width:260px;scroll-snap-align:start">' + renderProductCard(recs[r]) + '</div>';
    }
    html += '\
  </div>';
    return html;
  }

  function renderFeaturedCollections() {
    var collections = [
      { title: 'Exam Prep Bundle', icon: 'u{1F4DD}', count: 24, gradient: 'var(--gradient-primary)', desc: 'Practice tests, sample papers & more' },
      { title: 'Science Kit Collection', icon: 'u{1F52C}', count: 18, gradient: 'var(--gradient-green)', desc: 'Lab kits, models & experiment sets' },
      { title: 'Programming Starter Pack', icon: 'u{1F4BB}', count: 15, gradient: 'var(--gradient-secondary)', desc: 'Python, web dev & DSA courses' },
      { title: 'Art & Creativity', icon: 'u{1F3A8}', count: 12, gradient: 'linear-gradient(135deg,#f59e0b,#ec4899)', desc: 'Sketching, painting & craft kits' }
    ];
    var html = '\
  <div class="section-header">\
    <h2 class="section-title">Featured Collections</h2>\
  </div>\
  <div class="c-grid c-mb-8" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-4)">';
    for (var c = 0; c < collections.length; c++) {
      var col = collections[c];
      html += '\
    <div class="stat-card c-pointer c-relative c-overflow-hidden c-border-0" style="background:' + col.gradient + ';padding:var(--space-6)" data-action="marketplace:navigate:/marketplace">\
      <div class="c-mb-3" style="font-size:2.5rem">' + col.icon + '</div>\
      <div class="c-fs-lg c-fw-bold c-text-primary c-mb-1">' + col.title + '</div>\
      <div class="c-fs-sm c-text-primary c-mb-3" style="color:rgba(255,255,255,0.85)">' + col.desc + '</div>\
      <div class="c-flex-between">\
        <span class="c-fs-sm" style="color:rgba(255,255,255,0.7)">' + col.count + ' items</span>\
        <span class="c-text-primary c-fs-sm c-fw-semibold">Explore \u2192</span>\
      </div>\
    </div>';
    }
    html += '\
  </div>';
    return html;
  }

  function renderRecentlyViewed() {
    var viewed = store.get('recentlyViewed') || [];
    if (viewed.length === 0) return '';
    var mp = mockData.marketplace || [];
    var items = [];
    for (var i = 0; i < viewed.length && items.length < 10; i++) {
      for (var j = 0; j < mp.length; j++) {
        if (mp[j].id === viewed[i] && !isInList(items, mp[j].id)) {
          items.push(mp[j]);
          break;
        }
      }
    }
    if (items.length === 0) return '';
    var html = '\
  <div class="section-header">\
    <h2 class="section-title">Recently Viewed</h2>\
    <span class="section-action c-pointer c-fs-sm c-text-danger" data-action="marketplace:storeSet:recentlyViewed:[]">Clear</span>\
  </div>\
  <div class="c-flex c-overflow-auto c-mb-8" style="gap:var(--space-4);padding-bottom:var(--space-4);scroll-snap-type:x mandatory">';
    for (var k = 0; k < items.length; k++) {
      html += '<div class="c-pointer" style="min-width:260px;scroll-snap-align:start">' + renderProductCard(items[k]) + '</div>';
    }
    html += '\
  </div>';
    return html;
  }

  function isInList(arr, id) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return true;
    }
    return false;
  }

  window.renderPage.trackRecentlyViewed = function(id) {
    var viewed = store.get('recentlyViewed') || [];
    var idx = -1;
    for (var i = 0; i < viewed.length; i++) {
      if (viewed[i] === id) { idx = i; break; }
    }
    if (idx > -1) {
      viewed.splice(idx, 1);
    }
    viewed.unshift(id);
    if (viewed.length > 10) viewed = viewed.slice(0, 10);
    store.set('recentlyViewed', viewed);
  };

  window.renderPage.subscribeToPlan = function(planId) {
    var subs = mockData.subscriptions || [];
    var plan = null;
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].id === planId) { plan = subs[i]; break; }
    }
    if (!plan) return;
    var user = store.get('user') || {};
    user.plan = plan.badge;
    store.set('user', user);
    showToast('Subscribed to ' + plan.name + '!', 'success');
    window.renderPage.marketplace();
  };

  window.renderPage.addToCart = function(id) {
    var items = mockData.marketplace || [];
    var item = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { item = items[i]; break; }
    }
    if (!item) return;
    var cart = store.get('cart') || [];
    var found = false;
    for (var ci = 0; ci < cart.length; ci++) {
      if (cart[ci].id === id) { cart[ci].quantity = (cart[ci].quantity || 1) + 1; found = true; break; }
    }
    if (!found) { cart.push({ id: item.id, title: item.title, price: item.price, quantity: 1 }); }
    store.set('cart', cart);
    showToast(item.title + ' added to cart!', 'success');
  };

  window.renderPage.toggleWishlist = function(id) {
    var items = mockData.marketplace || [];
    var item = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { item = items[i]; break; }
    }
    if (item) toggleWishlist(item);
  };

  window.renderPage.goToPage = function(page) {
    filterState.page = page;
    var hash = window.location.hash.slice(1);
    if (hash.indexOf('?') > -1) {
      hash = hash.slice(0, hash.indexOf('?'));
    }
    router.navigate(hash + '?page=' + page);
  };

  function getMarketplaceCategories() {
    var mp = mockData.marketplace || [];
    var seen = {};
    var result = [];
    for (var i = 0; i < mp.length; i++) {
      var cat = mp[i].category;
      if (!seen[cat]) {
        seen[cat] = true;
        var icon = '\u0040\u0040EMOJI_PACK';
        for (var ci = 0; ci < CATEGORIES.length; ci++) {
          if (CATEGORIES[ci].slug === cat) { icon = CATEGORIES[ci].icon; break; }
        }
        result.push({ value: cat, label: getCategoryName(cat), icon: icon });
      }
    }
    result.sort(function(a, b) { return a.label.localeCompare(b.label); });
    return result;
  }

  function getMarketplaceSellers() {
    var mp = mockData.marketplace || [];
    var seen = {};
    var result = [];
    for (var i = 0; i < mp.length; i++) {
      var s = mp[i].seller;
      if (s && !seen[s]) {
        seen[s] = true;
        result.push(s);
      }
    }
    result.sort();
    return result;
  }

  function getActiveFilterCount() {
    var count = 0;
    if (filterState.search && filterState.search.trim()) count++;
    if (filterState.categories && filterState.categories.length > 0) count += filterState.categories.length;
    if (filterState.priceMin !== '' || filterState.priceMax !== '') count++;
    if (filterState.rating && filterState.rating !== '') count++;
    if (filterState.condition && filterState.condition.length > 0) count += filterState.condition.length;
    if (filterState.soldBy && filterState.soldBy.length > 0) count += filterState.soldBy.length;
    return count;
  }

  function renderFilterChips() {
    var html = '';
    if (filterState.search && filterState.search.trim()) {
      html += '\
  <span class="filter-chip c-inline-block c-flex c-flex-gap-2 c-bg-accent c-text-primary c-fs-xs" style="padding:3px 8px;border-radius:var(--radius-sm);cursor:default">\
    <span class="filter-chip-label">Search: "' + utils.sanitizeHTML(filterState.search) + '"</span>\
    <button class="filter-chip-remove c-border-0 c-text-primary c-pointer c-fs-sm" style="padding:0;line-height:1;background:none;color:white" title="Remove" data-action="marketplace:removeFilterChip:search">\u2715</button>\
  </span>';
    }
    if (filterState.categories) {
      for (var ci = 0; ci < filterState.categories.length; ci++) {
        var catVal = filterState.categories[ci];
        var catLabel = getCategoryName(catVal);
        html += '\
  <span class="filter-chip c-inline-block c-flex c-flex-gap-2 c-bg-accent c-text-primary c-fs-xs" style="padding:3px 8px;border-radius:var(--radius-sm);cursor:default">\
    <span class="filter-chip-label">' + utils.sanitizeHTML(catLabel) + '</span>\
    <button class="filter-chip-remove c-border-0 c-text-primary c-pointer c-fs-sm" style="padding:0;line-height:1;background:none;color:white" title="Remove" data-action="marketplace:removeFilterChip:categories:' + catVal.replace(/'/g, "\\'") + '">\u2715</button>\
  </span>';
      }
    }
    if (filterState.priceMin !== '' || filterState.priceMax !== '') {
      var priceLabel = '';
      if (filterState.priceMin !== '' && filterState.priceMax !== '') priceLabel = '₹' + filterState.priceMin + ' - ₹' + filterState.priceMax;
      else if (filterState.priceMin !== '') priceLabel = '₹' + filterState.priceMin + '+';
      else if (filterState.priceMax !== '') priceLabel = 'Up to ₹' + filterState.priceMax;
      html += '\
  <span class="filter-chip c-inline-block c-flex c-flex-gap-2 c-bg-accent c-text-primary c-fs-xs" style="padding:3px 8px;border-radius:var(--radius-sm);cursor:default">\
    <span class="filter-chip-label">Price: ' + priceLabel + '</span>\
    <button class="filter-chip-remove c-border-0 c-text-primary c-pointer c-fs-sm" style="padding:0;line-height:1;background:none;color:white" title="Remove" data-action="marketplace:removeFilterChip:price">\u2715</button>\
  </span>';
    }
    if (filterState.rating && filterState.rating !== '') {
      var ratingLabel = filterState.rating === '4' ? '4\u2B50+' : filterState.rating === '3' ? '3\u2B50+' : filterState.rating === '2' ? '2\u2B50+' : filterState.rating + '\u2B50+';
      html += '\
  <span class="filter-chip c-inline-block c-flex c-flex-gap-2 c-bg-accent c-text-primary c-fs-xs" style="padding:3px 8px;border-radius:var(--radius-sm);cursor:default">\
    <span class="filter-chip-label">' + ratingLabel + '</span>\
    <button class="filter-chip-remove c-border-0 c-text-primary c-pointer c-fs-sm" style="padding:0;line-height:1;background:none;color:white" title="Remove" data-action="marketplace:removeFilterChip:rating">\u2715</button>\
  </span>';
    }
    if (filterState.condition) {
      for (var di = 0; di < filterState.condition.length; di++) {
        var condVal = filterState.condition[di];
        html += '\
  <span class="filter-chip c-inline-block c-flex c-flex-gap-2 c-bg-accent c-text-primary c-fs-xs" style="padding:3px 8px;border-radius:var(--radius-sm);cursor:default">\
    <span class="filter-chip-label">' + utils.sanitizeHTML(condVal) + '</span>\
    <button class="filter-chip-remove c-border-0 c-text-primary c-pointer c-fs-sm" style="padding:0;line-height:1;background:none;color:white" title="Remove" data-action="marketplace:removeFilterChip:condition:' + condVal.replace(/'/g, "\\'") + '">\u2715</button>\
  </span>';
      }
    }
    if (filterState.soldBy) {
      for (var si = 0; si < filterState.soldBy.length; si++) {
        var sellerVal = filterState.soldBy[si];
        html += '\
  <span class="filter-chip c-inline-block c-flex c-flex-gap-2 c-bg-accent c-text-primary c-fs-xs" style="padding:3px 8px;border-radius:var(--radius-sm);cursor:default">\
    <span class="filter-chip-label">' + utils.sanitizeHTML(sellerVal) + '</span>\
    <button class="filter-chip-remove c-border-0 c-text-primary c-pointer c-fs-sm" style="padding:0;line-height:1;background:none;color:white" title="Remove" data-action="marketplace:removeFilterChip:soldBy:' + sellerVal.replace(/'/g, "\\'") + '">\u2715</button>\
  </span>';
      }
    }
    if (html) {
      html = '\
  <div class="c-flex c-flex-wrap c-mb-4" style="gap:6px">' + html + '\
  </div>';
    }
    return html;
  }

  function renderSectionTabs() {
    var html = '\
  <div class="c-flex c-mb-6" style="gap:var(--space-2);overflow-x:auto;padding-bottom:4px;flex-wrap:nowrap">';
    for (var i = 0; i < SECTION_TABS.length; i++) {
      var tab = SECTION_TABS[i];
      var active = filterState.view === tab.id;
      html += '\
    <button class="btn ' + (active ? 'btn-primary' : 'btn-ghost') + ' btn-sm c-nowrap c-pointer" style="flex-shrink:0" data-action="marketplace:switchView:' + tab.id + '">' + tab.icon + ' ' + tab.label + '</button>';
    }
    html += '\
  </div>';
    return html;
  }

  function openFilterDrawer() {
    var catOptions = getMarketplaceCategories();
    var sellerOptions = getMarketplaceSellers();
    window.FilterDrawer.openDrawer({
      title: 'Filter Products',
      filters: [
        {
          id: 'search',
          label: 'Search',
          type: 'search',
          value: filterState.search || '',
          placeholder: 'Search products...'
        },
        {
          id: 'category',
          label: 'Category',
          type: 'checkbox',
          options: catOptions,
          value: filterState.categories && filterState.categories.length > 0 ? filterState.categories.slice() : []
        },
        {
          id: 'price',
          label: 'Price Range',
          type: 'range',
          min: 0,
          max: 5000,
          value: { min: filterState.priceMin || '', max: filterState.priceMax || '' },
          minLabel: '₹',
          maxLabel: '₹',
          minPlaceholder: 'Min',
          maxPlaceholder: 'Max'
        },
        {
          id: 'rating',
          label: 'Minimum Rating',
          type: 'radio',
          options: [
            { value: '', label: 'Any' },
            { value: '4', label: '4\u2B50+' },
            { value: '3', label: '3\u2B50+' },
            { value: '2', label: '2\u2B50+' }
          ],
          value: filterState.rating !== null && filterState.rating !== undefined && filterState.rating !== '' ? String(filterState.rating) : ''
        },
        {
          id: 'condition',
          label: 'Condition',
          type: 'checkbox',
          options: [
            { value: 'New', label: 'New' },
            { value: 'Like New', label: 'Like New' },
            { value: 'Good', label: 'Good' },
            { value: 'Fair', label: 'Fair' }
          ],
          value: filterState.condition && filterState.condition.length > 0 ? filterState.condition.slice() : []
        },
        {
          id: 'soldBy',
          label: 'Sold By',
          type: 'checkbox',
          options: sellerOptions.map(function(s) { return { value: s, label: s }; }),
          value: filterState.soldBy && filterState.soldBy.length > 0 ? filterState.soldBy.slice() : []
        }
      ],
      onApply: function(allValues) {
        if (allValues.search !== undefined) filterState.search = allValues.search || '';
        if (allValues.category !== undefined) filterState.categories = allValues.category || [];
        if (allValues.price !== undefined) {
          filterState.priceMin = allValues.price.min !== undefined ? allValues.price.min : '';
          filterState.priceMax = allValues.price.max !== undefined ? allValues.price.max : '';
        }
        if (allValues.rating !== undefined) filterState.rating = (allValues.rating !== '' && allValues.rating !== null && allValues.rating !== undefined) ? allValues.rating : '';
        if (allValues.condition !== undefined) filterState.condition = allValues.condition || [];
        if (allValues.soldBy !== undefined) filterState.soldBy = allValues.soldBy || [];
        filterState.page = 1;
        window.renderPage.marketplace(router.getParams());
      },
      onReset: function() {
        filterState.search = '';
        filterState.categories = [];
        filterState.priceMin = '';
        filterState.priceMax = '';
        filterState.rating = '';
        filterState.condition = [];
        filterState.soldBy = [];
        filterState.categoryPill = 'all';
        filterState.page = 1;
        window.renderPage.marketplace(router.getParams());
      }
    });
  }

  window.renderPage.removeFilterChip = function(type, value) {
    if (type === 'search') {
      filterState.search = '';
    } else if (type === 'categories') {
      if (filterState.categories) {
        var ci = filterState.categories.indexOf(value);
        if (ci !== -1) filterState.categories.splice(ci, 1);
      }
    } else if (type === 'price') {
      filterState.priceMin = '';
      filterState.priceMax = '';
    } else if (type === 'rating') {
      filterState.rating = '';
    } else if (type === 'condition') {
      if (filterState.condition) {
        var di = filterState.condition.indexOf(value);
        if (di !== -1) filterState.condition.splice(di, 1);
      }
    } else if (type === 'soldBy') {
      if (filterState.soldBy) {
        var si = filterState.soldBy.indexOf(value);
        if (si !== -1) filterState.soldBy.splice(si, 1);
      }
    }
    filterState.page = 1;
    window.renderPage.marketplace(router.getParams());
  };

  window.renderPage.updateFilter = function(key, value) {
    filterState[key] = value;
    filterState.page = 1;
    window.renderPage.marketplace(router.getParams());
  };

  window.renderPage.clearFilters = function() {
    filterState.search = '';
    filterState.categories = [];
    filterState.priceMin = '';
    filterState.priceMax = '';
    filterState.rating = '';
    filterState.condition = [];
    filterState.soldBy = [];
    filterState.categoryPill = 'all';
    filterState.page = 1;
    window.renderPage.marketplace(router.getParams());
  };

  function applyFilters(items) {
    var filtered = items.slice();
    if (filterState.categoryPill && filterState.categoryPill !== 'all') {
      filtered = filtered.filter(function(i) { return i.category === filterState.categoryPill; });
    }
    if (filterState.search && filterState.search.trim()) {
      var q = filterState.search.toLowerCase().trim();
      filtered = filtered.filter(function(i) {
        return i.title.toLowerCase().indexOf(q) !== -1 || (i.description && i.description.toLowerCase().indexOf(q) !== -1);
      });
    }
    if (filterState.categories && filterState.categories.length > 0) {
      filtered = filtered.filter(function(i) {
        for (var c = 0; c < filterState.categories.length; c++) {
          if (i.category === filterState.categories[c]) return true;
        }
        return false;
      });
    }
    if (filterState.priceMin !== '' || filterState.priceMax !== '') {
      filtered = filtered.filter(function(i) {
        if (filterState.priceMin !== '' && i.price < parseFloat(filterState.priceMin)) return false;
        if (filterState.priceMax !== '' && i.price > parseFloat(filterState.priceMax)) return false;
        return true;
      });
    }
    if (filterState.rating && filterState.rating !== '') {
      var minRating = parseFloat(filterState.rating);
      filtered = filtered.filter(function(i) {
        return parseFloat(i.rating) >= minRating;
      });
    }
    if (filterState.soldBy && filterState.soldBy.length > 0) {
      filtered = filtered.filter(function(i) {
        for (var s = 0; s < filterState.soldBy.length; s++) {
          if (i.seller === filterState.soldBy[s]) return true;
        }
        return false;
      });
    }
    if (filterState.sort) {
      if (filterState.sort === 'price-asc') filtered.sort(function(a, b) { return a.price - b.price; });
      else if (filterState.sort === 'price-desc') filtered.sort(function(a, b) { return b.price - a.price; });
      else if (filterState.sort === 'newest') filtered.sort(function(a, b) { return parseInt(b.id.slice(1)) - parseInt(a.id.slice(1)); });
      else if (filterState.sort === 'popular') filtered.sort(function(a, b) { return b.reviews - a.reviews; });
    }
    return filtered;
  }

  var COUPONS = [
    { code: 'STUDY20', discount: '20% off on all books', type: 'percentage', value: 20, expiry: '2026-08-15', minPurchase: 299 },
    { code: 'FREESHIP', discount: 'Free shipping on orders above ₹500', type: 'free-shipping', value: 0, expiry: '2026-09-01', minPurchase: 500 },
    { code: 'EXAM50', discount: '₹50 off on mock test packs', type: 'flat', value: 50, expiry: '2026-07-31', minPurchase: 199 },
    { code: 'COMBO25', discount: '25% off on exam bundles', type: 'percentage', value: 25, expiry: '2026-08-30', minPurchase: 399 },
    { code: 'NEW10', discount: '10% off on your first purchase', type: 'percentage', value: 10, expiry: '2026-12-31', minPurchase: 0 },
    { code: 'EDU20', discount: '20% off on everything', type: 'percentage', value: 20, expiry: '2026-12-31', minPurchase: 0 }
  ];

  function renderDealTimer(deadline) {
    var now = new Date();
    var end = new Date(deadline);
    var diff = Math.max(0, Math.floor((end - now) / 3600000));
    return '<span class="c-fs-xs c-text-warning c-fw-semibold">\u23F1 Deal ends in ' + diff + 'h</span>';
  }

  function renderTodaysDeals() {
    var mp = mockData.marketplace || [];
    var dealItems = [];
    for (var d = 0; d < mp.length; d++) {
      if (mp[d].originalPrice && mp[d].originalPrice > mp[d].price && mp[d].discountPercent >= 20) {
        dealItems.push(mp[d]);
      }
    }
    dealItems = utils.shuffleArray(dealItems).slice(0, 8);
    if (dealItems.length === 0) return '';
    var deadline = new Date();
    deadline.setHours(deadline.getHours() + 18);
    var html = '\
  <div class="section-header c-mt-4" id="section-deals">\
    <h2 class="section-title c-flex c-flex-gap-2"><span style="font-size:1.5rem">\u0040\u0040EMOJI_FIRE</span> Today\'s Deals</h2>\
    <span class="section-action">' + renderDealTimer(deadline.toISOString()) + '</span>\
  </div>\
  <div class="c-flex c-overflow-auto c-mb-8" style="gap:var(--space-4);padding-bottom:var(--space-4);scroll-snap-type:x mandatory">';
    for (var i = 0; i < dealItems.length; i++) {
      html += '<div class="c-pointer" style="min-width:260px;scroll-snap-align:start">' + renderProductCard(dealItems[i], { isDeal: true }) + '</div>';
    }
    html += '\
  </div>';
    return html;
  }

  function renderNewArrivals() {
    var mp = mockData.marketplace || [];
    var sorted = mp.slice().sort(function(a, b) {
      return parseInt(b.id.slice(1)) - parseInt(a.id.slice(1));
    });
    var newItems = sorted.slice(0, 8);
    if (newItems.length === 0) return '';
    var html = '\
  <div class="section-header" id="section-newarrivals">\
    <h2 class="section-title c-flex c-flex-gap-2"><span style="font-size:1.5rem">\u0040\u0040EMOJI_NEW2</span> New Arrivals</h2>\
    <span class="section-action">View All \u2192</span>\
  </div>\
  <div class="c-flex c-overflow-auto c-mb-8" style="gap:var(--space-4);padding-bottom:var(--space-4);scroll-snap-type:x mandatory">';
    for (var i = 0; i < newItems.length; i++) {
      html += '<div class="c-pointer" style="min-width:260px;scroll-snap-align:start">' + renderProductCard(newItems[i], { isNew: true }) + '</div>';
    }
    html += '\
  </div>';
    return html;
  }

  function renderRecentlyPurchased() {
    var orders = getOrders();
    var purchasedIds = [];
    for (var o = 0; o < orders.length; o++) {
      if (orders[o].status === 'delivered') {
        for (var oi = 0; oi < orders[o].items.length; oi++) {
          purchasedIds.push(orders[o].items[oi].id);
        }
      }
    }
    if (purchasedIds.length === 0) return '';
    var mp = mockData.marketplace || [];
    var items = [];
    for (var i = 0; i < purchasedIds.length && items.length < 6; i++) {
      for (var j = 0; j < mp.length; j++) {
        if (mp[j].id === purchasedIds[i] && !isInList(items, mp[j].id)) {
          items.push(mp[j]);
          break;
        }
      }
    }
    if (items.length === 0) return '';
    var html = '\
  <div class="section-header">\
    <h2 class="section-title c-flex c-flex-gap-2"><span style="font-size:1.5rem">\u0040\u0040EMOJI_RECYCLE</span> Recently Purchased</h2>\
  </div>\
  <div class="c-flex c-overflow-auto c-mb-8" style="gap:var(--space-4);padding-bottom:var(--space-4);scroll-snap-type:x mandatory">';
    for (var k = 0; k < items.length; k++) {
      html += '\
    <div class="c-pointer" style="min-width:260px;scroll-snap-align:start">' + renderProductCard(items[k]) + '\
      <button class="btn btn-secondary btn-sm c-w-full c-mt-2" data-action="marketplace:addToCart:' + items[k].id + '">Buy Again</button>\
    </div>';
    }
    html += '\
  </div>';
    return html;
  }

  function renderCouponZone() {
    var html = '\
  <div class="section-header">\
    <h2 class="section-title c-flex c-flex-gap-2"><span style="font-size:1.5rem">\u0040\u0040EMOJI_TAG</span> Coupon Zone</h2>\
  </div>\
  <div class="c-flex c-overflow-auto c-mb-8" style="gap:var(--space-4);padding-bottom:var(--space-4);scroll-snap-type:x mandatory">';
    for (var i = 0; i < COUPONS.length; i++) {
      var cp = COUPONS[i];
      html += '\
    <div class="stat-card c-text-center" style="min-width:220px;scroll-snap-align:start;padding:var(--space-5);cursor:default;border:2px dashed var(--accent-blue)">\
      <div class="c-mb-2" style="font-size:2rem">\u0040\u0040EMOJI_TAG</div>\
      <div class="c-fs-lg c-fw-bold c-text-accent c-mb-2" style="letter-spacing:2px">' + cp.code + '</div>\
      <div class="c-fs-sm c-text-secondary c-mb-1">' + cp.discount + '</div>\
      <div class="c-fs-xs c-text-secondary c-mb-3">Expires: ' + cp.expiry + (cp.minPurchase > 0 ? ' \u2022 Min: ₹' + cp.minPurchase : '') + '</div>\
      <button class="btn btn-primary btn-sm" data-action="marketplace:copyCoupon:' + cp.code + '">Copy Code</button>\
    </div>';
    }
    html += '\
  </div>';
    return html;
  }

  window.renderPage.copyCoupon = function(code, btn) {
    var ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    if (btn) {
      btn.textContent = 'Copied! \u2713';
      btn.className = 'btn btn-green btn-sm';
      setTimeout(function() { btn.textContent = 'Copy Code'; btn.className = 'btn btn-primary btn-sm'; }, 2000);
    }
    showToast('Coupon code ' + code + ' copied!', 'success');
  };

  window.renderPage.toggleCompare = function(id, checked) {
    var compareItems = store.get('compareItems') || [];
    if (checked) {
      if (compareItems.length >= 4) {
        showToast('You can compare up to 4 items at a time', 'warning');
        var pages = document.querySelectorAll('.compare-checkbox');
        for (var p = 0; p < pages.length; p++) {
          if (pages[p].value === id) pages[p].checked = false;
        }
        return;
      }
      compareItems.push(id);
      store.set('compareItems', compareItems);
      showToast('Added to compare', 'info');
    } else {
      var idx = -1;
      for (var ci = 0; ci < compareItems.length; ci++) {
        if (compareItems[ci] === id) { idx = ci; break; }
      }
      if (idx > -1) compareItems.splice(idx, 1);
      store.set('compareItems', compareItems);
    }
    renderCompareBar();
  };

  function renderCompareBar() {
    var compareItems = store.get('compareItems') || [];
    var existing = document.getElementById('compare-bar');
    if (existing) existing.remove();
    if (compareItems.length === 0) return;
    var bar = document.createElement('div');
    bar.id = 'compare-bar';
    bar.className = 'c-fixed c-flex-between c-z-1000 c-shadow-lg';
    bar.style.cssText = 'bottom:0;left:0;right:0;background:var(--bg-secondary);border-top:2px solid var(--accent-blue);padding:var(--space-3) var(--space-6)';
    var left = document.createElement('div');
    left.className = 'c-flex c-flex-gap-3';
    left.innerHTML = '<span class="c-fw-semibold">Compare (' + compareItems.length + ')</span>';
    var right = document.createElement('div');
    right.className = 'c-flex c-flex-gap-3';
    var clearBtn = document.createElement('button');
    clearBtn.className = 'btn btn-ghost btn-sm';
    clearBtn.textContent = 'Clear All';
    clearBtn.setAttribute('data-action', 'marketplace:clearCompare');
    var compareBtn = document.createElement('button');
    compareBtn.className = 'btn btn-primary btn-sm';
    compareBtn.textContent = 'Compare';
    compareBtn.setAttribute('data-action', 'marketplace:showCompareTable');
    right.appendChild(clearBtn);
    right.appendChild(compareBtn);
    bar.appendChild(left);
    bar.appendChild(right);
    document.body.appendChild(bar);
  }

  window.renderPage.showCompareTable = function() {
    var compareItems = store.get('compareItems') || [];
    if (compareItems.length < 2) { showToast('Select at least 2 items to compare', 'warning'); return; }
    var mp = mockData.marketplace || [];
    var items = [];
    for (var i = 0; i < compareItems.length; i++) {
      for (var j = 0; j < mp.length; j++) {
        if (mp[j].id === compareItems[i]) { items.push(mp[j]); break; }
      }
    }
    if (items.length < 2) return;
    var conditions = ['New', 'Like New', 'Good', 'Fair'];
    var bestValueIdx = 0;
    var bestScore = -1;
    for (var bvi = 0; bvi < items.length; bvi++) {
      var score = items[bvi].rating / (items[bvi].originalPrice > items[bvi].price ? items[bvi].price : items[bvi].originalPrice || items[bvi].price);
      if (score > bestScore) { bestScore = score; bestValueIdx = bvi; }
    }
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    var tableHtml = '\
<div class="modal c-scroll-y" style="max-width:900px;width:95%;max-height:90vh">\
  <div class="modal-header">\
    <h3 class="c-fs-xl">\u0040\u0040EMOJI_CHART Compare Products</h3>\
    <button class="btn btn-ghost" data-action="marketplace:closeModal">\u2715</button>\
  </div>\
  <div class="modal-body c-overflow-auto">\
    <table class="c-w-full" style="border-collapse:collapse">\
      <thead>\
        <tr>';
    for (var ci = 0; ci < items.length; ci++) {
      var isBest = ci === bestValueIdx;
      tableHtml += '<th class="c-p-3 c-text-center c-border-bottom" style="' + (isBest ? 'border:2px solid var(--accent-gold);background:rgba(255,215,0,0.08)' : '') + '">' + (isBest ? '<div class="badge c-bg-accent c-fs-xs c-mb-2 c-inline-block" style="color:var(--bg-primary)">\u0040\u0040EMOJI_STAR Best Value</div>' : '') + '<div class="c-fw-bold">' + utils.sanitizeHTML(utils.truncate(items[ci].title, 20)) + '</div><div class="price c-fs-lg">' + utils.formatCurrency(items[ci].price) + '</div>' + (items[ci].originalPrice > items[ci].price ? '<div class="price-original c-fs-sm">' + utils.formatCurrency(items[ci].originalPrice) + '</div>' : '') + '</th>';
    }
    tableHtml += '\
        </tr>\
      </thead>\
      <tbody>\
        <tr><td class="c-p-3 c-fw-semibold c-border-bottom">Rating</td>';
    for (var ci2 = 0; ci2 < items.length; ci2++) {
      tableHtml += '<td class="c-p-3 c-text-center c-border-bottom">' + renderStars(items[ci2].rating) + '<br><span>' + items[ci2].rating + ' (' + items[ci2].reviews + ' reviews)</span></td>';
    }
    tableHtml += '</tr>\
        <tr><td class="c-p-3 c-fw-semibold c-border-bottom">Category</td>';
    for (var ci3 = 0; ci3 < items.length; ci3++) {
      tableHtml += '<td class="c-p-3 c-text-center c-border-bottom">' + getCategoryName(items[ci3].category) + '</td>';
    }
    tableHtml += '</tr>\
        <tr><td class="c-p-3 c-fw-semibold c-border-bottom">Condition</td>';
    for (var ciCond = 0; ciCond < items.length; ciCond++) {
      var cond = conditions[parseInt(items[ciCond].id.slice(1)) % conditions.length];
      tableHtml += '<td class="c-p-3 c-text-center c-border-bottom">' + cond + '</td>';
    }
    tableHtml += '</tr>\
        <tr><td class="c-p-3 c-fw-semibold c-border-bottom">Seller</td>';
    for (var ciSell = 0; ciSell < items.length; ciSell++) {
      tableHtml += '<td class="c-p-3 c-text-center c-border-bottom c-fs-sm">' + utils.sanitizeHTML(items[ciSell].seller || 'EduMentee') + '</td>';
    }
    tableHtml += '</tr>\
        <tr><td class="c-p-3 c-fw-semibold c-border-bottom">Discount</td>';
    for (var ciDisc = 0; ciDisc < items.length; ciDisc++) {
      var discPct = items[ciDisc].originalPrice ? Math.round((1 - items[ciDisc].price / items[ciDisc].originalPrice) * 100) : 0;
      tableHtml += '<td class="c-p-3 c-text-center c-border-bottom">' + (discPct > 0 ? '<span class="badge badge-green">-' + discPct + '%</span>' : '<span class="text-secondary">None</span>') + '</td>';
    }
    tableHtml += '</tr>\
        <tr><td class="c-p-3 c-fw-semibold c-border-bottom">Delivery</td>';
    for (var ci4 = 0; ci4 < items.length; ci4++) {
      tableHtml += '<td class="c-p-3 c-text-center c-border-bottom">' + (items[ci4].deliveryInfo || 'Standard') + '</td>';
    }
    tableHtml += '</tr>\
        <tr><td class="c-p-3 c-fw-semibold c-border-bottom">Stock</td>';
    for (var ci5 = 0; ci5 < items.length; ci5++) {
      tableHtml += '<td class="c-p-3 c-text-center c-border-bottom"><span class="badge ' + (items[ci5].inStock ? 'badge-green' : 'badge-red') + '">' + (items[ci5].inStock ? 'In Stock' : 'Out of Stock') + '</span></td>';
    }
    tableHtml += '</tr>\
      </tbody>\
    </table>\
  </div>\
  <div class="modal-footer c-flex-end c-flex-gap-3">\
    <button class="btn btn-secondary" data-action="marketplace:closeModal">Close</button>\
  </div>\
</div>';
    overlay.innerHTML = tableHtml;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  };
  function renderGalleryImages(item, gradient, emoji) {
    var images = [
      { bg: gradient, emoji: emoji },
      { bg: 'linear-gradient(135deg,#667eea,#764ba2)', emoji: '\u0040\u0040EMOJI_BOOK' },
      { bg: 'linear-gradient(135deg,#f093fb,#f5576c)', emoji: '\u0040\u0040EMOJI_BOOKS' },
      { bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', emoji: '\u0040\u0040EMOJI_STAR2' }
    ];
    var html = '\
  <div class="product-gallery c-mb-4">\
    <div class="gallery-main c-relative c-flex-center c-transition" id="gallery-main" style="height:400px;background:' + images[0].bg + ';border-radius:var(--radius-xl)">\
      <span id="gallery-emoji" style="font-size:6rem">' + images[0].emoji + '</span>\
      ' + (item.originalPrice > item.price ? '<div class="badge badge-red c-absolute c-fs-base" style="top:var(--space-4);left:var(--space-4);padding:0.5rem 1rem">-' + Math.round((1 - item.price / item.originalPrice) * 100) + '%</div>' : '') + '\
    </div>\
    <div class="c-flex c-flex-gap-2 c-mt-3">';
    for (var g = 0; g < images.length; g++) {
      html += '\
      <div class="gallery-thumb c-flex-center c-pointer c-transition" data-action="marketplace:switchGalleryImage:' + g + '" style="width:72px;height:72px;border-radius:var(--radius-md);background:' + images[g].bg + ';font-size:1.5rem;border:2px solid transparent">' + images[g].emoji + '</div>';
    }
    html += '\
    </div>\
  </div>';
    return html;
  }

  window.renderPage.switchGalleryImage = function(index) {
    var gradients = [
      'var(--gradient-primary)', 'linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)', 'linear-gradient(135deg,#4facfe,#00f2fe)'
    ];
    var emojis = ['\u0040\u0040EMOJI_PACK', '\u0040\u0040EMOJI_BOOK', '\u0040\u0040EMOJI_BOOKS', '\u0040\u0040EMOJI_STAR2'];
    var main = document.getElementById('gallery-main');
    var emoji = document.getElementById('gallery-emoji');
    if (main && emoji) {
      main.style.background = gradients[index] || gradients[0];
      emoji.textContent = emojis[index] || emojis[0];
    }
  };

  function renderEnhancedReviews(item) {
    var reviewData = [
      { name: 'Aarav S.', rating: 5, text: 'Excellent quality, exactly what I needed for my exam prep.', date: '2 weeks ago', helpful: 24, avatar: 'AS' },
      { name: 'Priya P.', rating: 4, text: 'Good product, delivery was on time. Would recommend.', date: '1 month ago', helpful: 18, avatar: 'PP' },
      { name: 'Rahul V.', rating: 5, text: 'Great value for money. Helped me score well in my exams.', date: '3 weeks ago', helpful: 31, avatar: 'RV' },
      { name: 'Sneha K.', rating: 3, text: 'Decent product but could be better. Packaging was good.', date: '2 months ago', helpful: 7, avatar: 'SK' },
      { name: 'Ankit S.', rating: 4, text: 'Very useful for revision. Fast delivery.', date: '5 days ago', helpful: 12, avatar: 'AS' }
    ];
    var avgRating = 0;
    for (var r = 0; r < reviewData.length; r++) { avgRating += reviewData[r].rating; }
    avgRating = (avgRating / reviewData.length).toFixed(1);
    var starCounts = [0, 0, 0, 0, 0];
    for (var r2 = 0; r2 < reviewData.length; r2++) {
      starCounts[reviewData[r2].rating - 1]++;
    }
    var html = '\
  <div class="section-header c-mt-10">\
    <h2 class="section-title">Customer Reviews</h2>\
  </div>\
  <div class="c-grid c-mb-8" style="grid-template-columns:280px 1fr;gap:var(--space-8)">\
    <div class="stat-card c-text-center" style="padding:var(--space-6)">\
      <div class="c-text-warning c-fw-bold" style="font-size:var(--text-4xl)">' + avgRating + '</div>\
      <div class="c-mt-2 c-mb-2">' + renderStars(parseFloat(avgRating)) + '</div>\
      <div class="c-fs-sm c-text-secondary">' + reviewData.length + ' reviews</div>\
      <div class="c-mt-4 c-text-left">';
    for (var s = 5; s >= 1; s--) {
      var pct = Math.round(starCounts[s - 1] / reviewData.length * 100);
      html += '\
        <div class="c-flex c-flex-gap-2 c-mb-1">\
          <span class="c-fs-xs" style="min-width:30px">' + s + ' \u2605</span>\
          <div class="c-overflow-hidden" style="flex:1;height:8px;background:var(--bg-tertiary);border-radius:4px">\
            <div class="c-bg-accent" style="width:' + pct + '%;height:100%;border-radius:4px"></div>\
          </div>\
          <span class="c-fs-xs c-text-secondary" style="min-width:20px">' + pct + '%</span>\
        </div>';
    }
    html += '\
      </div>\
    </div>\
    <div>';
    for (var rv = 0; rv < reviewData.length; rv++) {
      var rev = reviewData[rv];
      html += '\
      <div class="comment c-relative">\
        <div class="avatar" style="background:' + utils.getGradient(rv) + '">' + rev.avatar + '</div>\
        <div class="comment-content">\
          <div class="comment-header">\
            <span class="comment-author">' + rev.name + '</span>\
            <span class="comment-time">' + rev.date + '</span>\
          </div>\
          <div class="rating c-mb-1">';
      for (var ss = 0; ss < 5; ss++) {
        html += '<span class="star' + (ss >= rev.rating ? ' star-empty' : '') + '">\u2605</span>';
      }
      html += '\
          </div>\
          <div class="c-text-secondary c-fs-sm c-mb-2">' + utils.sanitizeHTML(rev.text) + '</div>\
          <button class="btn btn-ghost btn-sm c-fs-xs" style="padding:2px 8px" data-action="marketplace:helpful">\u0040\u0040EMOJI_THUMBSUP Helpful (<span class="helpful-count">' + rev.helpful + '</span>)</button>\
        </div>\
      </div>';
    }
    html += '\
      <button class="btn btn-primary c-mt-4" data-action="marketplace:openReviewModal">\u0040\u0040EMOJI_PENCIL Write a Review</button>\
    </div>\
  </div>';
    return html;
  }

  window.renderPage.openReviewModal = function() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '\
<div class="modal" style="max-width:500px">\
  <div class="modal-header">\
    <h3 class="c-fs-xl">\u0040\u0040EMOJI_PENCIL Write a Review</h3>\
    <button class="btn btn-ghost" data-action="marketplace:closeModal">\u2715</button>\
  </div>\
  <div class="modal-body">\
    <div class="c-mb-4">\
      <label class="c-block c-mb-2 c-fw-semibold">Your Rating</label>\
      <div id="review-star-picker" class="c-pointer" style="font-size:2rem">\
        <span class="star star-empty" data-val="1" data-action-hover="marketplace:previewStars:1" data-action="marketplace:setReviewRating:1">\u2605</span>\
        <span class="star star-empty" data-val="2" data-action-hover="marketplace:previewStars:2" data-action="marketplace:setReviewRating:2">\u2605</span>\
        <span class="star star-empty" data-val="3" data-action-hover="marketplace:previewStars:3" data-action="marketplace:setReviewRating:3">\u2605</span>\
        <span class="star star-empty" data-val="4" data-action-hover="marketplace:previewStars:4" data-action="marketplace:setReviewRating:4">\u2605</span>\
        <span class="star star-empty" data-val="5" data-action-hover="marketplace:previewStars:5" data-action="marketplace:setReviewRating:5">\u2605</span>\
      </div>\
    </div>\
    <div class="c-mb-4">\
      <label class="c-block c-mb-2 c-fw-semibold">Your Name</label>\
      <input type="text" class="input-field c-w-full" id="review-name" placeholder="Enter your name">\
    </div>\
    <div class="c-mb-4">\
      <label class="c-block c-mb-2 c-fw-semibold">Your Review</label>\
      <textarea class="input-field c-w-full" id="review-text" rows="4" placeholder="Write your review..." style="resize:vertical"></textarea>\
    </div>\
    <button class="btn btn-primary c-w-full" data-action="marketplace:submitReview">Submit Review</button>\
  </div>\
</div>';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  };

  window.renderPage.previewStars = function(val) {
    var spans = document.querySelectorAll('#review-star-picker .star');
    for (var i = 0; i < spans.length; i++) {
      if (i < val) spans[i].className = 'star'; else spans[i].className = 'star star-empty';
    }
  };

  window.renderPage.setReviewRating = function(val) {
    window.renderPage.previewStars(val);
  };

  window.renderPage.submitReview = function() {
    var name = document.getElementById('review-name');
    var text = document.getElementById('review-text');
    var stars = document.querySelectorAll('#review-star-picker .star:not(.star-empty)');
    if (!name || !text || stars.length === 0) {
      showToast('Please fill in all fields and select a rating', 'warning');
      return;
    }
    if (!name.value.trim()) { showToast('Please enter your name', 'warning'); return; }
    if (!text.value.trim()) { showToast('Please write a review', 'warning'); return; }
    var overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
    showToast('Thank you for your review!', 'success');
  };

  var CATEGORY_DETAILS = {
    books: { icon: '\u0040\u0040EMOJI_BOOKS', desc: 'Textbooks, reference books & guides for all subjects', gradient: 'var(--gradient-primary)' },
    stationery: { icon: '\u0040\u0040EMOJI_PEN', desc: 'Pens, notebooks, geometry boxes & more', gradient: 'var(--gradient-secondary)' },
    notes: { icon: '\u0040\u0040EMOJI_NOTE', desc: 'Handwritten & digital premium notes for quick revision', gradient: 'var(--gradient-purple)' },
    courses: { icon: '\u0040\u0040EMOJI_GRAD', desc: 'Online courses with live classes & recorded sessions', gradient: 'var(--gradient-blue)' },
    'mock-tests': { icon: '\u0040\u0040EMOJI_CLIP', desc: 'Practice tests, previous papers & sample questions', gradient: 'var(--gradient-orange)' },
    'exam-bundles': { icon: '\u0040\u0040EMOJI_PACK', desc: 'Complete exam preparation bundles at great prices', gradient: 'var(--gradient-green)' },
    'practice-books': { icon: '\u0040\u0040EMOJI_BOOK2', desc: 'Workbooks & practice sets for daily practice', gradient: 'var(--gradient-pink)' },
    accessories: { icon: '\u0040\u0040EMOJI_HEADPH', desc: 'Educational accessories, gadgets & learning tools', gradient: 'var(--gradient-cyan)' }
  };

  function renderEnhancedCategory(cat) {
    var details = CATEGORY_DETAILS[cat.slug] || { icon: cat.icon, desc: 'Educational products', gradient: 'var(--gradient-primary)' };
    var count = countCategoryItems(cat.slug);
    return '\
    <div class="stat-card c-pointer c-overflow-hidden c-relative" data-action="marketplace:navigate:/marketplace/category/' + cat.slug + '">\
      <div style="background:' + details.gradient + ';margin:-var(--space-5);padding:var(--space-6);margin-bottom:0">\
        <div class="c-mb-2" style="font-size:2.5rem">' + details.icon + '</div>\
        <div class="font-semibold c-fs-lg c-text-primary">' + cat.name + '</div>\
        <div class="c-fs-xs c-text-primary" style="color:rgba(255,255,255,0.85)">' + details.desc + '</div>\
      </div>\
      <div class="c-flex-between" style="padding-top:var(--space-3)">\
        <span class="text-secondary text-sm">' + count + ' items</span>\
        <span class="c-fs-sm c-text-accent c-fw-semibold">Browse \u2192</span>\
      </div>\
    </div>';
  }

  var productDrawerOverlay = null;

  window.renderPage.openProductDrawer = function(id) {
    var allItems = mockData.marketplace || [];
    var item = null;
    for (var di = 0; di < allItems.length; di++) {
      if (allItems[di].id === id) { item = allItems[di]; break; }
    }
    if (!item) return;
    window.renderPage.trackRecentlyViewed(id);
    var discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
    var gradient = utils.getGradient(parseInt(item.id.slice(1)) || 0);
    var emojis = { books: '\u0040\u0040EMOJI_BOOK', stationery: '\u0040\u0040EMOJI_PEN', notes: '\u0040\u0040EMOJI_NOTE', courses: '\u0040\u0040EMOJI_GRAD', 'mock-tests': '\u0040\u0040EMOJI_CLIP', 'exam-bundles': '\u0040\u0040EMOJI_PACK', 'practice-books': '\u0040\u0040EMOJI_BOOK2', accessories: '\u0040\u0040EMOJI_HEADPH', electronics: '\u0040\u0040EMOJI_LAPTOP' };
    var emoji = emojis[item.category] || '\u0040\u0040EMOJI_PACK';
    var related = allItems.filter(function(i) { return i.category === item.category && i.id !== item.id; }).slice(0, 4);
    var drawer = document.createElement('div');
    drawer.id = 'product-drawer';
    drawer.className = 'c-fixed c-z-1000 c-scroll-y c-shadow-lg';
    drawer.style.cssText = 'top:0;right:0;width:620px;max-width:100vw;height:100vh;background:var(--bg-primary);box-shadow:-4px 0 30px rgba(0,0,0,0.3);transition:transform 0.3s ease;transform:translateX(100%)';
    var reviewData = [
      { name: 'Aarav S.', rating: 5, text: 'Excellent quality, exactly what I needed for exam prep.', date: '2 weeks ago', helpful: 24 },
      { name: 'Priya P.', rating: 4, text: 'Good product, delivery was on time. Would recommend.', date: '1 month ago', helpful: 18 },
      { name: 'Rahul V.', rating: 5, text: 'Great value for money. Helped me score well.', date: '3 weeks ago', helpful: 31 },
      { name: 'Sneha K.', rating: 3, text: 'Decent product but could be better. Packaging was good.', date: '2 months ago', helpful: 7 },
      { name: 'Ankit S.', rating: 4, text: 'Very useful for revision. Fast delivery.', date: '5 days ago', helpful: 12 }
    ];
    var avgRating = 0;
    for (var ri = 0; ri < reviewData.length; ri++) { avgRating += reviewData[ri].rating; }
    avgRating = (avgRating / reviewData.length).toFixed(1);
    var imgGradients = [gradient, 'linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)', 'linear-gradient(135deg,#4facfe,#00f2fe)'];
    var imgEmojis = [emoji, '\u0040\u0040EMOJI_BOOK', '\u0040\u0040EMOJI_STAR2', '\u0040\u0040EMOJI_PACK'];
    function renderGallery() {
      var gh = '<div class="c-flex c-flex-gap-2 c-mb-4">';
      for (var gi = 0; gi < imgGradients.length; gi++) {
        gh += '<div class="c-pointer c-flex-center" data-action="marketplace:switchGalleryImage:' + gi + '" id="gallery-thumb-' + gi + '" style="width:72px;height:72px;border-radius:var(--radius-md);background:' + imgGradients[gi] + ';font-size:1.5rem;border:2px solid ' + (gi === 0 ? 'var(--accent-blue)' : 'transparent') + '">' + imgEmojis[gi] + '</div>';
      }
      gh += '</div>';
      return gh;
    }
    var drawerHtml = '\
<div class="c-p-4">\
  <div class="c-flex-between c-mb-4">\
    <h2 class="c-fs-xl c-fw-bold" id="product-drawer-title">' + utils.sanitizeHTML(item.title) + '</h2>\
    <button class="btn btn-ghost c-fs-lg" data-action="marketplace:closeProductDrawer">\u2715</button>\
  </div>\
  <div class="c-mb-4">\
    <div class="c-flex-center c-relative c-overflow-hidden" id="product-drawer-main-img" style="height:300px;border-radius:var(--radius-xl);background:' + imgGradients[0] + ';transition:background 0.3s">\
      <span id="product-drawer-main-emoji" style="font-size:5rem">' + imgEmojis[0] + '</span>\
      ' + (discount > 0 ? '<div class="badge badge-red c-absolute c-fs-sm" style="top:var(--space-3);left:var(--space-3);padding:6px 12px">-' + discount + '%</div>' : '') + '\
    </div>\
    ' + renderGallery() + '\
  </div>\
  <div class="c-mb-3">\
    <div class="c-flex c-flex-gap-2 c-mb-1">\
      <span class="c-fs-xs c-text-secondary">Product ID: ' + item.id + '</span>\
      <span class="c-fs-xs c-text-secondary">|</span>\
      <span class="c-fs-xs c-text-secondary">' + utils.sanitizeHTML(getCategoryName(item.category)) + '</span>\
    </div>\
    <h3 class="c-fs-2xl c-fw-bold c-mb-2">' + utils.sanitizeHTML(item.title) + '</h3>\
    <div class="c-flex c-flex-gap-2 c-mb-2" style="align-items:center">' + renderStars(item.rating) + ' <span class="c-fw-semibold c-fs-sm">' + item.rating + '</span> <span class="c-fs-xs c-text-secondary">(' + utils.formatNumber(item.reviews) + ' reviews)</span></div>\
    <div class="c-flex c-flex-gap-3 c-mb-4" style="align-items:baseline">\
      <span class="price c-fs-2xl c-fw-bold" style="color:var(--accent-blue)">' + utils.formatCurrency(item.price) + '</span>\
      ' + (item.originalPrice > item.price ? '<span class="price-original c-fs-lg c-text-secondary" style="text-decoration:line-through">' + utils.formatCurrency(item.originalPrice) + '</span>' : '') + '\
      ' + (discount > 0 ? '<span class="badge badge-green c-fs-sm">' + discount + '% off</span>' : '') + '\
    </div>\
    <p class="c-text-secondary c-fs-sm c-mb-4" style="line-height:1.7">' + utils.sanitizeHTML(item.description) + '</p>\
    <div class="c-mb-4 c-radius-lg" style="overflow:hidden;border:1px solid var(--border-color)">\
      <h4 class="c-fs-sm c-fw-semibold c-p-3" style="background:var(--bg-secondary);border-bottom:1px solid var(--border-color);margin:0">Specifications</h4>\
      <div class="c-grid" style="grid-template-columns:1fr 1fr">\
        <div class="c-p-3 c-border-bottom c-fs-xs c-text-secondary">Condition</div><div class="c-p-3 c-border-bottom c-fs-xs c-fw-semibold">New</div>\
        <div class="c-p-3 c-border-bottom c-fs-xs c-text-secondary">Stock</div><div class="c-p-3 c-border-bottom c-fs-xs c-fw-semibold">' + (item.inStock ? 'In Stock' : 'Out of Stock') + '</div>\
        <div class="c-p-3 c-border-bottom c-fs-xs c-text-secondary">Delivery</div><div class="c-p-3 c-border-bottom c-fs-xs c-fw-semibold">' + (item.deliveryInfo || (item.price >= 500 ? 'Free Delivery' : '₹40 shipping')) + '</div>\
        <div class="c-p-3 c-border-bottom c-fs-xs c-text-secondary">Seller</div><div class="c-p-3 c-border-bottom c-fs-xs c-fw-semibold">' + utils.sanitizeHTML(item.seller || 'EduMentee') + '</div>\
        <div class="c-p-3 c-fs-xs c-text-secondary">Returns</div><div class="c-p-3 c-fs-xs c-fw-semibold">7 Days Easy Return</div>\
      </div>\
    </div>\
    <div class="c-mb-4 c-radius-lg" style="border:1px solid var(--border-color);overflow:hidden">\
      <div class="c-p-3 c-flex c-flex-gap-3" style="background:var(--bg-secondary);align-items:center">\
        <div class="c-flex-center c-fw-bold c-fs-sm" style="width:40px;height:40px;border-radius:50%;background:' + utils.getGradient(parseInt(item.id.slice(1)) || 1) + ';color:#fff">' + (item.seller ? item.seller.charAt(0) : 'E') + '</div>\
        <div>\
          <div class="c-fs-sm c-fw-semibold">Sold by ' + utils.sanitizeHTML(item.seller || 'EduMentee') + '</div>\
          <div class="c-fs-xs c-text-secondary">' + (Math.floor(Math.random() * 90) + 10) + '% Positive Feedback | ' + (Math.floor(Math.random() * 5000) + 100) + ' Ratings</div>\
        </div>\
      </div>\
    </div>\
  </div>\
  <div class="c-flex c-flex-gap-3 c-mb-6">\
    <button class="btn btn-primary c-flex-1" data-action="marketplace:addToCart:' + item.id + '" ' + (!item.inStock ? 'disabled' : '') + '>\u0040\u0040EMOJI_CART Add to Cart</button>\
    <button class="btn btn-secondary c-flex-1" data-action="marketplace:buyNow:' + item.id + '" ' + (!item.inStock ? 'disabled' : '') + '>\u0040\u0040EMOJI_LIGHTNING Buy Now</button>\
    <button class="btn btn-ghost c-fs-lg c-flex-center" data-action="marketplace:toggleWishlist:' + item.id + '" style="min-width:44px;color:' + (isInWishlist(item.id) ? 'var(--accent-red)' : 'var(--text-secondary)') + '">' + (isInWishlist(item.id) ? '\u0040\u0040EMOJI_HEART_FILLED' : '\u0040\u0040EMOJI_HEART_EMPTY') + '</button>\
  </div>\
  <div class="c-border-top c-pt-4 c-mb-4">\
    <h4 class="c-fw-semibold c-mb-3">Ratings & Reviews</h4>\
    <div class="c-flex c-flex-gap-3 c-mb-4 c-radius-lg" style="padding:var(--space-3);background:var(--bg-secondary)">\
      <div class="c-text-center c-p-3">\
        <div class="c-text-warning c-fw-bold" style="font-size:var(--text-3xl)">' + avgRating + '</div>\
        <div class="c-fs-xs c-text-secondary">' + reviewData.length + ' ratings</div>\
      </div>\
      <div style="flex:1">';
    for (var si = 5; si >= 1; si--) {
      var pct = 0;
      for (var ri2 = 0; ri2 < reviewData.length; ri2++) { if (reviewData[ri2].rating === si) pct++; }
      pct = Math.round(pct / reviewData.length * 100);
      drawerHtml += '\
        <div class="c-flex c-flex-gap-2 c-mb-1" style="align-items:center">\
          <span class="c-fs-xs" style="min-width:24px">' + si + ' \u2605</span>\
          <div class="c-overflow-hidden" style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:3px">\
            <div class="c-bg-accent" style="width:' + pct + '%;height:100%;border-radius:3px"></div>\
          </div>\
          <span class="c-fs-xs c-text-secondary" style="min-width:20px">' + pct + '%</span>\
        </div>';
    }
    drawerHtml += '\
      </div>\
    </div>\
    <div class="c-scroll-y" style="max-height:240px">';
    for (var rv = 0; rv < reviewData.length; rv++) {
      var rev = reviewData[rv];
      drawerHtml += '\
      <div class="c-flex c-flex-gap-3 c-border-bottom" style="padding:var(--space-3)">\
        <div class="c-flex-center c-fw-bold c-fs-sm" style="width:36px;height:36px;border-radius:50%;background:' + utils.getGradient(rv) + ';color:#fff;font-size:12px;flex-shrink:0">' + rev.name.charAt(0) + (rev.name.split(' ')[1] || '').charAt(0) + '</div>\
        <div style="flex:1;min-width:0">\
          <div class="c-flex-between c-mb-1">\
            <span class="c-fw-semibold c-fs-sm">' + rev.name + '</span>\
            <span class="c-fs-xs c-text-secondary">' + rev.date + '</span>\
          </div>\
          <div class="c-fs-xs c-mb-1">';
      for (var ss = 0; ss < 5; ss++) {
        drawerHtml += '<span class="star' + (ss >= rev.rating ? ' star-empty' : '') + ' c-fs-xs">\u2605</span>';
      }
      drawerHtml += '\
          </div>\
          <div class="c-fs-sm c-text-secondary">' + utils.sanitizeHTML(rev.text) + '</div>\
          <button class="btn btn-ghost btn-sm c-fs-xs c-mt-1" style="padding:2px 8px" data-action="marketplace:helpful">\u0040\u0040EMOJI_THUMBSUP Helpful (' + rev.helpful + ')</button>\
        </div>\
      </div>';
    }
    drawerHtml += '\
    </div>\
  </div>';
    if (related.length > 0) {
      drawerHtml += '\
  <div class="c-border-top c-pt-4 c-mb-4">\
    <div class="c-fw-semibold c-mb-3">Related Products</div>\
    <div class="c-flex c-flex-gap-3 c-overflow-auto" style="padding-bottom:var(--space-3)">';
      for (var rl = 0; rl < related.length; rl++) {
        var rlGrad = utils.getGradient(parseInt(related[rl].id.slice(1)) || rl);
        var rlEmoji = emojis[related[rl].category] || '\u0040\u0040EMOJI_PACK';
        drawerHtml += '\
      <div class="c-pointer c-flex-shrink-0" style="width:130px" data-action="marketplace:openProductDrawer:' + related[rl].id + '">\
        <div class="c-flex-center c-mb-2" style="height:90px;border-radius:var(--radius-md);background:' + rlGrad + '">\
          <span style="font-size:1.5rem">' + rlEmoji + '</span>\
        </div>\
        <div class="c-fs-xs c-fw-semibold c-ellipsis">' + utils.truncate(related[rl].title, 18) + '</div>\
        <div class="price c-fs-sm">' + utils.formatCurrency(related[rl].price) + '</div>\
      </div>';
      }
      drawerHtml += '\
    </div>\
  </div>';
    }
    drawerHtml += '\
</div>';
    drawer.innerHTML = drawerHtml;
    productDrawerOverlay = document.createElement('div');
    productDrawerOverlay.id = 'product-drawer-overlay';
    productDrawerOverlay.className = 'c-fixed c-transition';
    productDrawerOverlay.style.cssText = 'top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;opacity:0';
    productDrawerOverlay.setAttribute('data-action', 'marketplace:closeProductDrawer');
    document.body.appendChild(productDrawerOverlay);
    document.body.appendChild(drawer);
    requestAnimationFrame(function() {
      productDrawerOverlay.style.opacity = '1';
      drawer.style.transform = 'translateX(0)';
    });
  };

  window.renderPage.closeProductDrawer = function() {
    var drawer = document.getElementById('product-drawer');
    var overlay = document.getElementById('product-drawer-overlay');
    if (overlay) { overlay.style.opacity = '0'; }
    if (drawer) { drawer.style.transform = 'translateX(100%)'; }
    setTimeout(function() {
      if (drawer && drawer.parentNode) drawer.parentNode.removeChild(drawer);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      productDrawerOverlay = null;
    }, 300);
  };

  function renderTopBar() {
    var html = '\
<div class="top-bar c-flex c-flex-gap-4 c-mb-4" style="background:var(--bg-secondary);border-radius:var(--radius-lg);padding:var(--space-4);align-items:center;flex-wrap:wrap">\
  <div class="top-bar-logo c-fw-bold c-fs-lg c-text-accent" style="flex-shrink:0" data-action="marketplace:navigate:marketplace">\u0040\u0040EMOJI_STORE EduMart</div>\
  <div class="top-bar-search" style="flex:1;min-width:200px;max-width:500px;position:relative">\
    <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:var(--text-sm);opacity:0.5">\u0040\u0040EMOJI_SEARCH</span>\
    <input type="text" class="input-field c-w-full" placeholder="Search products, subjects, courses..." value="' + utils.sanitizeHTML(filterState.search || '') + '" data-action-onenter="marketplace:updateFilter:search" style="padding-left:36px;border-radius:20px;background:var(--bg-primary)">\
  </div>\
  <div class="top-bar-actions c-flex c-flex-gap-3" style="flex-shrink:0;align-items:center">\
    <button class="btn btn-ghost btn-sm c-relative" data-action="marketplace:navigate:cart" title="Cart" style="font-size:var(--text-xl)">\
      \u0040\u0040EMOJI_CART\
      ' + (getCartCount() > 0 ? '<span class="top-bar-badge c-absolute c-flex-center" style="top:-4px;right:-8px;min-width:18px;height:18px;border-radius:9px;background:var(--accent-red);color:#fff;font-size:10px;font-weight:700;padding:0 4px">' + getCartCount() + '</span>' : '') + '\
    </button>\
    <button class="btn btn-ghost btn-sm c-relative" data-action="marketplace:navigate:marketplace?wishlist=1" title="Wishlist" style="font-size:var(--text-xl)">\u0040\u0040EMOJI_HEART_EMPTY\
      ' + (getWishlistCount() > 0 ? '<span class="top-bar-badge c-absolute c-flex-center" style="top:-4px;right:-8px;min-width:18px;height:18px;border-radius:9px;background:var(--accent-pink);color:#fff;font-size:10px;font-weight:700;padding:0 4px">' + getWishlistCount() + '</span>' : '') + '\
    </button>\
    <button class="btn btn-ghost btn-sm" data-action="marketplace:navigate:cart?tab=orders" style="font-size:var(--text-sm)">\u0040\u0040EMOJI_PACK Orders</button>\
  </div>\
</div>';
    return html;
  }

  function renderCategoryNav() {
    var current = filterState.categoryPill || 'all';
    var html = '<div class="category-nav c-flex c-flex-gap-2 c-mb-4" style="overflow-x:auto;padding-bottom:var(--space-2);flex-wrap:nowrap;gap:6px">';
    for (var i = 0; i < CATEGORY_NAV.length; i++) {
      var nav = CATEGORY_NAV[i];
      var active = current === nav.id;
      html += '<button class="category-nav-btn ' + (active ? 'category-nav-active' : '') + '" data-action="marketplace:setCategoryPill:' + nav.id + '" style="padding:6px 16px;border-radius:20px;border:none;font-size:var(--text-sm);cursor:pointer;white-space:nowrap;transition:all 0.2s;font-weight:' + (active ? '600' : '400') + ';background:' + (active ? 'var(--accent-blue)' : 'var(--bg-tertiary)') + ';color:' + (active ? '#fff' : 'var(--text-secondary)') + '">' + nav.label + '</button>';
    }
    html += '</div>';
    return html;
  }

  function renderWishlistPage(wlItems) {
    var html = '\
<div class="page-container-inner">\
  <div class="page-header">\
    <div>\
      <h1 class="page-title c-flex c-flex-gap-2"><span style="color:var(--accent-pink)">\u0040\u0040EMOJI_HEART_FILLED</span> My Wishlist <span class="c-fs-sm c-text-secondary c-fw-normal">(' + wlItems.length + ' item' + (wlItems.length !== 1 ? 's' : '') + ')</span></h1>\
    </div>\
    <div class="c-flex c-flex-gap-3">\
      <button class="btn btn-ghost btn-sm" data-action="marketplace:navigate:marketplace">\u2190 Back to Marketplace</button>\
      ' + (wlItems.length > 0 ? '<button class="btn btn-secondary btn-sm" data-action="marketplace:clearWishlist">Clear All</button>' : '') + '\
    </div>\
  </div>';
    if (wlItems.length === 0) {
      html += '\
  <div class="empty-state">\
    <div class="empty-state-icon" style="font-size:4rem;color:var(--accent-pink)">\u0040\u0040EMOJI_HEART_EMPTY</div>\
    <h2 class="empty-state-title">Your Wishlist is Empty</h2>\
    <p class="empty-state-text">Save items you love and come back anytime.</p>\
    <button class="btn btn-primary" data-action="marketplace:navigate:marketplace">Browse Products</button>\
  </div>';
    } else {
      html += '\
  <div class="marketplace-grid c-mt-6">';
      for (var wi = 0; wi < wlItems.length; wi++) {
        var wlGrad = utils.getGradient(parseInt(wlItems[wi].id.slice(1)) || wi);
        var wlEmoji = '\u0040\u0040EMOJI_PACK';
        html += '\
    <div class="product-card c-relative" data-action="marketplace:openProductDrawer:' + wlItems[wi].id + '">\
      <div class="product-image" style="background:' + wlGrad + '">\
        <span class="c-fs-lg" style="font-size:3rem">' + wlEmoji + '</span>\
        <div class="badge c-bg-accent c-text-primary c-fs-xs c-absolute" style="top:var(--space-2);left:var(--space-2);padding:2px 7px">\u0040\u0040EMOJI_HEART_FILLED Wishlist</div>\
      </div>\
      <div class="product-body">\
        <div class="product-category">' + utils.sanitizeHTML(getCategoryName(wlItems[wi].category)) + '</div>\
        <div class="product-title">' + utils.sanitizeHTML(utils.truncate(wlItems[wi].title, 40)) + '</div>\
        <div class="c-flex c-flex-gap-2 c-mb-2">\
          <span class="price">' + utils.formatCurrency(wlItems[wi].price) + '</span>\
          ' + (wlItems[wi].originalPrice > wlItems[wi].price ? '<span class="price-original">' + utils.formatCurrency(wlItems[wi].originalPrice) + '</span>' : '') + '\
        </div>\
        <div class="product-footer">\
          <button class="btn btn-primary btn-sm add-cart-btn" data-action="marketplace:addToCart:' + wlItems[wi].id + '">\u0040\u0040EMOJI_CART Move to Cart</button>\
          <button class="btn btn-ghost btn-sm c-fs-lg" data-action="marketplace:toggleWishlist:' + wlItems[wi].id + '" style="color:var(--accent-pink)">\u0040\u0040EMOJI_HEART_FILLED</button>\
        </div>\
      </div>\
    </div>';
      }
      html += '\
  </div>';
    }
    html += '\
</div>';
    return html;
  }

  window.renderPage.marketplace = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    if (params && params.page) filterState.page = parseInt(params.page) || 1;

    var allItems = (mockData.marketplace || []).slice();

    var filteredItems = applyFilters(allItems);
    var total = filteredItems.length;
    var page = filterState.page || 1;
    var start = (page - 1) * PAGE_SIZE;
    var end = Math.min(start + PAGE_SIZE, total);
    var pageItems = filteredItems.slice(start, end);

    var activeFilterCount = getActiveFilterCount();

    var featured = allItems.slice().sort(function(a, b) { return b.rating - a.rating; }).slice(0, 8);
    var bestSellers = allItems.slice().sort(function(a, b) { return b.reviews - a.reviews; }).slice(0, 8);
    var trending = utils.shuffleArray(allItems.slice()).slice(0, 8);

    var html = '';

    if (params && params.wishlist) {
      var wl = getWishlist();
      var mp = mockData.marketplace || [];
      var wlItems = [];
      for (var wi = 0; wi < wl.length; wi++) {
        for (var wj = 0; wj < mp.length; wj++) {
          if (mp[wj].id === wl[wi].id) { wlItems.push(mp[wj]); break; }
        }
      }
      mainContent.innerHTML = renderWishlistPage(wlItems);
      return;
    }

    html = '\
<div class="page-container-inner">\
  ' + renderTopBar() + '\
  ' + renderCategoryNav() + '\
  <div class="page-header c-mb-0">\
    <div>\
      <h2 class="c-fs-2xl c-fw-bold c-text-primary">' + (filterState.search ? 'Search: &quot;' + utils.sanitizeHTML(filterState.search) + '&quot;' : 'All Products') + '</h2>\
      <p class="c-fs-sm c-text-secondary">' + total + ' result' + (total !== 1 ? 's' : '') + ' found</p>\
    </div>\
    <div class="c-flex c-flex-gap-2">\
      <select class="input-field" style="width:auto;min-width:130px;padding:0.4rem 2rem 0.4rem 0.75rem;font-size:var(--text-sm)" data-action-onchange="marketplace:updateFilter:sort">\
        <option value=""' + (filterState.sort === '' ? ' selected' : '') + '>Sort: Featured</option>\
        <option value="price-asc"' + (filterState.sort === 'price-asc' ? ' selected' : '') + '>Price: Low to High</option>\
        <option value="price-desc"' + (filterState.sort === 'price-desc' ? ' selected' : '') + '>Price: High to Low</option>\
        <option value="newest"' + (filterState.sort === 'newest' ? ' selected' : '') + '>Newest</option>\
        <option value="popular"' + (filterState.sort === 'popular' ? ' selected' : '') + '>Most Popular</option>\
      </select>\
      <button class="btn btn-secondary btn-sm" data-action="marketplace:openFilterDrawer" style="position:relative">\
        Filters\
        ' + (activeFilterCount > 0 ? '<span class="c-absolute c-flex-center" style="top:-6px;right:-6px;background:var(--accent-red);color:white;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:9px;padding:0 4px">' + activeFilterCount + '</span>' : '') + '\
      </button>\
    </div>\
  </div>\
  ' + renderFilterChips() + '\
  <div class="marketplace-grid c-mt-2">' + renderProductCards(filteredItems, start, end) + '</div>\
  ' + renderPagination(total, page, PAGE_SIZE);

    if (filterState.view === 'marketplace' || filterState.view === 'deals') {
      html += '\
  ' + renderTodaysDeals();
    }

    if (filterState.view === 'marketplace') {
      html += '\
  <div class="banner-slider" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-8)">';
      for (var b = 0; b < BANNER_DEALS.length; b++) {
        var deal = BANNER_DEALS[b];
        html += '\
    <div class="stat-card" style="background:' + deal.bg + ';border:none;padding:var(--space-6)">\
      <div style="font-size:2.5rem;margin-bottom:var(--space-3)">' + deal.emoji + '</div>\
      <div style="font-size:var(--text-xl);font-weight:700;color:white">' + deal.title + '</div>\
      <div style="font-size:var(--text-sm);color:rgba(255,255,255,0.8);margin-top:var(--space-1)">' + deal.subtitle + '</div>\
      <button class="btn btn-sm c-mt-4" style="background:rgba(255,255,255,0.2);color:white" data-action="marketplace:navigate:marketplace">Shop Now \u2192</button>\
    </div>';
      }
      html += '\
  </div>\
  ' + renderNewArrivals() + '\
  <div class="section-header">\
    <h2 class="section-title">Categories</h2>\
  </div>\
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-4);margin-bottom:var(--space-8)">';
      for (var c = 0; c < CATEGORIES.length; c++) {
        var cat = CATEGORIES[c];
        html += renderEnhancedCategory(cat);
      }
      html += '\
  </div>\
  ' + renderPremiumSection() + '\
  ' + renderFeaturedCollections() + '\
  ' + renderRecommendations() + '\
  <div class="section-header">\
    <h2 class="section-title">Featured Products</h2>\
    <span class="section-action">View All \u2192</span>\
  </div>\
  <div style="display:flex;gap:var(--space-4);overflow-x:auto;padding-bottom:var(--space-4);margin-bottom:var(--space-8);scroll-snap-type:x mandatory">';
      for (var f = 0; f < featured.length; f++) {
        html += '<div style="min-width:260px;scroll-snap-align:start">' + renderProductCard(featured[f]) + '</div>';
      }
      html += '\
  </div>\
  ' + renderRecentlyViewed() + '\
  ' + renderRecentlyPurchased() + '\
  ' + renderCouponZone();
    }

    if (filterState.view === 'marketplace' || filterState.view === 'deals') {
      if (bestSellers.length > 0) {
        html += '\
  <div class="section-header" style="margin-top:var(--space-10)" id="section-bestsellers">\
    <h2 class="section-title">Best Sellers</h2>\
    <span class="section-action">View All \u2192</span>\
  </div>\
  <div style="display:flex;gap:var(--space-4);overflow-x:auto;padding-bottom:var(--space-4);margin-bottom:var(--space-8);scroll-snap-type:x mandatory">';
        for (var bs = 0; bs < bestSellers.length; bs++) {
          html += '<div style="min-width:260px;scroll-snap-align:start">' + renderProductCard(bestSellers[bs], { isBestSeller: true }) + '</div>';
        }
        html += '\
  </div>';
      }

      if (trending.length > 0) {
        html += '\
  <div class="section-header">\
    <h2 class="section-title">Trending Now</h2>\
    <span class="section-action">View All \u2192</span>\
  </div>\
  <div style="display:flex;gap:var(--space-4);overflow-x:auto;padding-bottom:var(--space-4);margin-bottom:var(--space-8);scroll-snap-type:x mandatory">';
        for (var t = 0; t < trending.length; t++) {
          html += '<div style="min-width:260px;scroll-snap-align:start">' + renderProductCard(trending[t], { isTrending: true }) + '</div>';
        }
        html += '\
  </div>';
      }
    }

    if (filterState.view === 'bestsellers') {
      if (bestSellers.length > 0) {
        html += '\
  <div class="section-header" style="margin-top:var(--space-6)" id="section-bestsellers">\
    <h2 class="section-title">Best Sellers</h2>\
    <span class="section-action">View All \u2192</span>\
  </div>\
  <div style="display:flex;gap:var(--space-4);overflow-x:auto;padding-bottom:var(--space-4);margin-bottom:var(--space-8);scroll-snap-type:x mandatory">';
        for (var bs = 0; bs < bestSellers.length; bs++) {
          html += '<div style="min-width:260px;scroll-snap-align:start">' + renderProductCard(bestSellers[bs], { isBestSeller: true }) + '</div>';
        }
        html += '\
  </div>';
      }
    }

    if (filterState.view === 'newarrivals') {
      html += renderNewArrivals();
    }

    if (filterState.view === 'compare') {
      html += '\
  <div style="text-align:center;padding:var(--space-8);margin-bottom:var(--space-6)">\
    <div style="font-size:3rem;margin-bottom:var(--space-4)">\u0040\u0040EMOJI_CHART</div>\
    <h2 style="font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--space-2)">Compare Products</h2>\
    <p style="color:var(--text-secondary);margin-bottom:var(--space-4)">Select up to 4 products to compare their features side by side.</p>\
    <p style="color:var(--text-secondary);font-size:var(--text-sm)">Check the "Compare" checkbox on product cards below, then click "Compare" in the bar at the bottom.</p>\
  </div>';
    }

    html += '</div>';
    mainContent.innerHTML = html;
    renderCompareBar();
  };
  window.renderPage.marketplaceCategory = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    var catSlug = params && params.cat ? params.cat : '';
    var sortBy = params && params.sort ? params.sort : '';
    var page = 1;
    if (params && params.page) page = parseInt(params.page) || 1;
    var catName = getCategoryName(catSlug);
    var allItems = (mockData.marketplace || []).slice().filter(function(i) { return i.category === catSlug; });

    if (sortBy === 'price-asc') allItems.sort(function(a, b) { return a.price - b.price; });
    else if (sortBy === 'price-desc') allItems.sort(function(a, b) { return b.price - a.price; });
    else if (sortBy === 'rating') allItems.sort(function(a, b) { return b.rating - a.rating; });
    else if (sortBy === 'newest') allItems.sort(function(a, b) { return parseInt(b.id.slice(1)) - parseInt(a.id.slice(1)); });

    var total = allItems.length;
    var start = (page - 1) * PAGE_SIZE;
    var end = Math.min(start + PAGE_SIZE, total);
    var pageItems = allItems.slice(start, end);

    var html = '\
<div class="page-container-inner">\
  <div class="page-header">\
    <div class="flex items-center gap-3">\
      <button class="btn btn-ghost btn-sm c-fs-lg" data-action="marketplace:navigate:back">\u2190</button>\
      <div>\
        <h1 class="page-title">' + utils.sanitizeHTML(catName) + '</h1>\
        <p class="page-subtitle">' + total + ' products available</p>\
      </div>\
    </div>\
    <div class="c-flex c-flex-gap-3">\
      <select class="input-field" style="width:auto;padding:0.5rem 2rem 0.5rem 0.75rem" data-action-onchange="marketplace:categoryNavigate:' + catSlug + '">\
        <option value="">Sort by</option>\
        <option value="price-asc"' + (sortBy === 'price-asc' ? ' selected' : '') + '>Price: Low to High</option>\
        <option value="price-desc"' + (sortBy === 'price-desc' ? ' selected' : '') + '>Price: High to Low</option>\
        <option value="rating"' + (sortBy === 'rating' ? ' selected' : '') + '>Rating</option>\
        <option value="newest"' + (sortBy === 'newest' ? ' selected' : '') + '>Newest</option>\
      </select>\
      <button class="header-btn" data-action="marketplace:navigate:cart" title="Cart">\
        \u0040\u0040EMOJI_CART\
        ' + (getCartCount() > 0 ? '<span class="notif-dot c-flex-center" style="top:2px;right:2px;width:18px;height:18px;font-size:10px">' + getCartCount() + '</span>' : '') + '\
      </button>\
    </div>\
  </div>\
  <div class="marketplace-grid">' + renderProductCards(allItems, start, end) + '</div>\
  ' + renderPagination(total, page, PAGE_SIZE) + '\
</div>';
    mainContent.innerHTML = html;
  };

  window.renderPage.productDetail = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    var id = params && params.id ? params.id : '';
    var allItems = mockData.marketplace || [];
    var item = null;
    for (var i = 0; i < allItems.length; i++) {
      if (allItems[i].id === id) { item = allItems[i]; break; }
    }
    if (!item) {
      mainContent.innerHTML = '\
<div class="empty-state">\
  <div class="empty-state-icon">\u0040\u0040EMOJI_SEARCH</div>\
  <h2 class="empty-state-title">Product Not Found</h2>\
  <p class="empty-state-text">The product you\'re looking for doesn\'t exist.</p>\
  <button class="btn btn-primary" data-action="marketplace:navigate:marketplace">Back to Marketplace</button>\
</div>';
      return;
    }
    var discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
    var gradient = utils.getGradient(parseInt(item.id.slice(1)) || 0);
    var related = allItems.filter(function(i) { return i.category === item.category && i.id !== item.id; }).slice(0, 4);
    var emojis = { books: '\u0040\u0040EMOJI_BOOK', stationery: '\u0040\u0040EMOJI_PEN', notes: '\u0040\u0040EMOJI_NOTE', courses: '\u0040\u0040EMOJI_GRAD', 'mock-tests': '\u0040\u0040EMOJI_CLIP', 'exam-bundles': '\u0040\u0040EMOJI_PACK', 'practice-books': '\u0040\u0040EMOJI_BOOK2', accessories: '\u0040\u0040EMOJI_HEADPH' };
    var emoji = emojis[item.category] || '\u0040\u0040EMOJI_PACK';

    var html = '\
<div class="page-container-inner">\
  <div class="c-flex c-flex-gap-2 c-fs-sm c-text-secondary c-mb-6">\
    <a href="#/marketplace" class="c-text-secondary">Marketplace</a>\
    <span>/</span>\
    <a href="#/marketplace/category/' + item.category + '" class="c-text-secondary">' + utils.sanitizeHTML(getCategoryName(item.category)) + '</a>\
    <span>/</span>\
    <span class="c-text-primary">' + utils.sanitizeHTML(utils.truncate(item.title, 30)) + '</span>\
  </div>\
  <div class="c-grid c-mb-8" style="grid-template-columns:1fr 1fr;gap:var(--space-8)">\
    <div>' + renderGalleryImages(item, gradient, emoji) + '\
    </div>\
    <div>\
      <div class="product-category c-mb-2">' + utils.sanitizeHTML(getCategoryName(item.category)) + '</div>\
      <h1 class="c-fw-bold c-mb-3" style="font-size:var(--text-3xl)">' + utils.sanitizeHTML(item.title) + '</h1>\
      <div class="product-rating c-mb-4">\
        ' + renderStars(item.rating) + '\
        <span class="c-fw-semibold">' + item.rating + '</span>\
        <span>(' + utils.formatNumber(item.reviews) + ' reviews)</span>\
      </div>\
      <div class="c-flex c-flex-gap-3 c-mb-6">\
        <span class="price" style="font-size:var(--text-3xl)">' + utils.formatCurrency(item.price) + '</span>\
        ' + (item.originalPrice > item.price ? '<span class="price-original c-fs-xl">' + utils.formatCurrency(item.originalPrice) + '</span>' : '') + '\
        ' + (discount > 0 ? '<span class="badge badge-green">' + discount + '% off</span>' : '') + '\
      </div>\
      <p class="c-text-secondary c-mb-6" style="line-height:1.7">' + utils.sanitizeHTML(item.description) + '</p>\
      <div class="c-flex c-flex-gap-4 c-mb-4">\
        <div><span class="text-secondary text-sm">Status: </span><span class="badge ' + (item.inStock ? 'badge-green' : 'badge-red') + '">' + (item.inStock ? 'In Stock' : 'Out of Stock') + '</span></div>\
        ' + (item.quantity ? '<div><span class="text-secondary text-sm">Quantity: </span><span>' + item.quantity + ' available</span></div>' : '') + '\
        ' + (item.price >= 500 ? '<div><span class="badge badge-green">Free Delivery</span></div>' : '') + '\
      </div>\
      <div class="c-flex c-flex-gap-4 c-mt-6">\
        <button class="btn btn-primary" data-action="marketplace:addToCart:' + item.id + '" ' + (!item.inStock ? 'disabled' : '') + '>Add to Cart</button>\
        <button class="btn btn-secondary" data-action="marketplace:addToCart:' + item.id + '" ' + (!item.inStock ? 'disabled' : '') + '>Buy Now</button>\
        <button class="btn btn-ghost c-fs-lg" data-action="marketplace:toggleWishlist:' + item.id + '">' + (isInWishlist(item.id) ? '\u0040\u0040EMOJI_HEART_FILLED' : '\u0040\u0040EMOJI_HEART_EMPTY') + '</button>\
      </div>\
    </div>\
  </div>\
  ' + renderEnhancedReviews(item);

    if (related.length > 0) {
      html += '\
  <div class="section-header">\
    <h2 class="section-title">Related Products</h2>\
    <span class="section-action c-pointer" data-action="marketplace:navigate:marketplace/category/' + item.category + '">View All \u2192</span>\
  </div>\
  <div class="marketplace-grid">';
      for (var rl = 0; rl < related.length; rl++) {
        html += renderProductCard(related[rl]);
      }
      html += '\
  </div>';
    }
    html += '\
</div>';
    mainContent.innerHTML = html;
  };
  window.renderPage.checkoutStep = function(step) {
    var cart = store.get('cart') || [];
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) { subtotal += (cart[i].price || 0) * (cart[i].quantity || 1); }
    var appliedCoupon = store.get('appliedCoupon') || null;
    var discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') discountAmount = Math.round(subtotal * appliedCoupon.discount / 100);
      else discountAmount = Math.min(appliedCoupon.discount, subtotal);
    }
    var shipping = subtotal >= 500 ? 0 : 40;
    var tax = Math.round((subtotal - discountAmount) * 0.18);
    var total = subtotal - discountAmount + shipping + tax;
    var steps = ['cart', 'shipping', 'payment', 'confirmation'];
    var stepNames = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
    var stepIcons = ['\u0040\u0040EMOJI_CART', '\u0040\u0040EMOJI_PACK', '\u0040\u0040EMOJI_CREDITCARD', '\u0040\u0040EMOJI_CHECKMARK'];
    var currentIdx = 0;
    for (var s = 0; s < steps.length; s++) { if (steps[s] === step) { currentIdx = s; break; } }
    var stepHtml = '<div class="c-flex-center c-flex-gap-4 c-mb-8 c-py-4">';
    for (var st = 0; st < steps.length; st++) {
      stepHtml += '\
    <div class="c-flex c-flex-gap-2">\
      <div class="c-flex-center c-fw-bold c-fs-sm" style="width:36px;height:36px;border-radius:50%;background:' + (st <= currentIdx ? 'var(--accent-blue)' : 'var(--bg-tertiary)') + ';color:' + (st <= currentIdx ? 'white' : 'var(--text-secondary)') + '">' + stepIcons[st] + '</div>\
      <span class="c-fs-sm" style="font-weight:' + (st === currentIdx ? '700' : '400') + ';color:' + (st === currentIdx ? 'var(--accent-blue)' : 'var(--text-secondary)') + '">' + stepNames[st] + '</span>\
    </div>' + (st < steps.length - 1 ? '<div style="width:40px;height:2px;background:' + (st < currentIdx ? 'var(--accent-blue)' : 'var(--bg-tertiary)') + '"></div>' : '');
    }
    stepHtml += '</div>';

    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    var bodyHtml = '';
    if (step === 'shipping') {
      var savedAddr = store.get('shippingAddress');
      bodyHtml = '\
    <div style="max-width:600px;margin:0 auto">\
      <h3 class="c-fs-xl c-mb-6">\u0040\u0040EMOJI_PACK Shipping Address</h3>\
      <div class="c-grid c-mb-4" style="grid-template-columns:1fr 1fr;gap:var(--space-4)">\
        <div>\
          <label class="c-block c-mb-1 c-fs-sm">Full Name *</label>\
          <input type="text" class="input-field c-w-full" id="ship-name" value="' + (savedAddr ? savedAddr.name : '') + '" placeholder="John Doe">\
        </div>\
        <div>\
          <label class="c-block c-mb-1 c-fs-sm">Phone *</label>\
          <input type="tel" class="input-field c-w-full" id="ship-phone" value="' + (savedAddr ? savedAddr.phone : '') + '" placeholder="+91 98765 43210">\
        </div>\
      </div>\
      <div class="c-mb-4">\
        <label class="c-block c-mb-1 c-fs-sm">Address *</label>\
        <input type="text" class="input-field c-w-full" id="ship-address" value="' + (savedAddr ? savedAddr.address : '') + '" placeholder="123 Education Lane">\
      </div>\
      <div class="c-grid c-mb-4" style="grid-template-columns:1fr 1fr 1fr;gap:var(--space-4)">\
        <div>\
          <label class="c-block c-mb-1 c-fs-sm">City *</label>\
          <input type="text" class="input-field c-w-full" id="ship-city" value="' + (savedAddr ? savedAddr.city : '') + '" placeholder="Mumbai">\
        </div>\
        <div>\
          <label class="c-block c-mb-1 c-fs-sm">State *</label>\
          <input type="text" class="input-field c-w-full" id="ship-state" value="' + (savedAddr ? savedAddr.state : '') + '" placeholder="Maharashtra">\
        </div>\
        <div>\
          <label class="c-block c-mb-1 c-fs-sm">Pin Code *</label>\
          <input type="text" class="input-field c-w-full" id="ship-pin" value="' + (savedAddr ? savedAddr.pin : '') + '" placeholder="400001">\
        </div>\
      </div>\
      <div class="c-flex c-flex-gap-4 c-flex-between c-mt-8">\
        <button class="btn btn-ghost" data-action="marketplace:navigate:cart">\u2190 Back to Cart</button>\
        <button class="btn btn-primary" data-action="marketplace:proceedToPayment">Proceed to Payment \u2192</button>\
      </div>\
    </div>';
    } else if (step === 'payment') {
      var savedPay = store.get('paymentMethod');
      bodyHtml = '\
    <div style="max-width:600px;margin:0 auto">\
      <h3 class="c-fs-xl c-mb-6">\u0040\u0040EMOJI_CREDITCARD Payment Method</h3>\
      <div class="c-mb-4">\
        <label class="stat-card c-flex c-flex-gap-4 c-pointer c-p-4" style="border:2px solid ' + ((!savedPay || savedPay.method === 'cod') ? 'var(--accent-blue)' : 'var(--border-color)') + '" data-action="marketplace:storeSet:selectPayment:cod">\
          <input type="radio" name="payment" id="pay-cod" value="cod" ' + ((!savedPay || savedPay.method === 'cod') ? 'checked' : '') + ' data-action-onchange="marketplace:selectPayment:cod">\
          <span class="c-fs-lg">\u0040\u0040EMOJI_MONEY</span>\
          <div><div class="font-semibold">Cash on Delivery</div><div class="text-secondary text-sm">Pay when you receive</div></div>\
        </label>\
      </div>\
      <div class="c-mb-4">\
        <label class="stat-card c-flex c-flex-gap-4 c-pointer c-p-4" style="border:2px solid ' + (savedPay && savedPay.method === 'card' ? 'var(--accent-blue)' : 'var(--border-color)') + '" data-action="marketplace:storeSet:selectPayment:card">\
          <input type="radio" name="payment" id="pay-card" value="card" ' + (savedPay && savedPay.method === 'card' ? 'checked' : '') + ' data-action-onchange="marketplace:selectPayment:card">\
          <span class="c-fs-lg">\u0040\u0040EMOJI_CREDITCARD</span>\
          <div><div class="font-semibold">Credit / Debit Card</div><div class="text-secondary text-sm">Visa, Mastercard, RuPay</div></div>\
        </label>\
      </div>\
      <div class="c-mb-4">\
        <label class="stat-card c-flex c-flex-gap-4 c-pointer c-p-4" style="border:2px solid ' + (savedPay && savedPay.method === 'upi' ? 'var(--accent-blue)' : 'var(--border-color)') + '" data-action="marketplace:storeSet:selectPayment:upi">\
          <input type="radio" name="payment" id="pay-upi" value="upi" ' + (savedPay && savedPay.method === 'upi' ? 'checked' : '') + ' data-action-onchange="marketplace:selectPayment:upi">\
          <span class="c-fs-lg">\u0040\u0040EMOJI_PHONE</span>\
          <div><div class="font-semibold">UPI / Net Banking</div><div class="text-secondary text-sm">GPay, PhonePe, Paytm</div></div>\
        </label>\
      </div>\
      <div class="c-flex c-flex-gap-4 c-flex-between c-mt-8">\
        <button class="btn btn-ghost" data-action="marketplace:checkoutStep:shipping">\u2190 Back to Shipping</button>\
        <button class="btn btn-primary" data-action="marketplace:placeOrder">Place Order \u2192</button>\
      </div>\
    </div>';
    } else if (step === 'confirmation') {
      var orderId = 'ORD' + Date.now().toString(36).toUpperCase();
      var shippingAddr = store.get('shippingAddress') || { name: 'N/A', address: 'N/A', city: 'N/A', state: 'N/A', pin: 'N/A' };
      var payMethod = store.get('paymentMethod') || { method: 'cod' };
      var payLabels = { cod: 'Cash on Delivery', card: 'Credit/Debit Card', upi: 'UPI / Net Banking' };
      bodyHtml = '\
    <div class="c-text-center" style="max-width:600px;margin:0 auto">\
      <div class="c-mb-4" style="font-size:4rem">\u0040\u0040EMOJI_PARTY</div>\
      <h3 class="c-fs-2xl c-mb-2">Order Confirmed!</h3>\
      <p class="text-secondary c-mb-6">Your order <strong>' + orderId + '</strong> has been placed successfully.</p>\
      <div class="stat-card c-text-left c-p-5 c-mb-6">\
        <div class="c-mb-4">\
          <div class="font-semibold c-mb-2">\u0040\u0040EMOJI_PACK Shipping To</div>\
          <div class="text-secondary text-sm">' + shippingAddr.name + '</div>\
          <div class="text-secondary text-sm">' + shippingAddr.address + '</div>\
          <div class="text-secondary text-sm">' + shippingAddr.city + ', ' + shippingAddr.state + ' - ' + shippingAddr.pin + '</div>\
        </div>\
        <div class="c-pt-3 c-border-top">\
          <div class="font-semibold c-mb-2">\u0040\u0040EMOJI_CREDITCARD Payment</div>\
          <div class="text-secondary text-sm">' + (payLabels[payMethod.method] || 'Cash on Delivery') + '</div>\
          <div class="text-secondary text-sm">Total: <strong class="price">' + utils.formatCurrency(total) + '</strong></div>\
        </div>\
      </div>\
      <button class="btn btn-secondary" data-action="marketplace:navigate:marketplace">Continue Shopping</button>\
      <button class="btn btn-primary c-ml-2" data-action="marketplace:navigate:cart">View Orders</button>\
    </div>';
      store.set('cart', []);
      store.set('appliedCoupon', null);
      var existingOrders = store.get('orders') || [];
      existingOrders.unshift({ id: orderId, date: new Date().toISOString().split('T')[0], items: cart, subtotal: subtotal, discount: discountAmount, shipping: shipping, tax: tax, total: total, status: 'processing', billing: shippingAddr });
      store.set('orders', existingOrders);
    }

    var html = '\
<div class="page-container-inner" style="max-width:800px;margin:0 auto">\
  <div class="page-header">\
    <h1 class="page-title">Checkout</h1>\
    <button class="header-btn" data-action="marketplace:navigate:cart" title="Cart">\
      \u0040\u0040EMOJI_CART\
      ' + (cart.length > 0 ? '<span class="notif-dot c-flex-center" style="top:2px;right:2px;width:18px;height:18px;font-size:10px">' + cart.length + '</span>' : '') + '\
    </button>\
  </div>\
  ' + stepHtml + '\
  <div class="c-grid" style="grid-template-columns:1fr 300px;gap:var(--space-8)">\
    <div>' + bodyHtml + '</div>\
    <div>\
      <div class="stat-card" style="position:sticky;top:var(--space-6)">\
        <h4 class="font-semibold c-mb-4">Order Summary</h4>\
        <div class="c-fs-sm c-mb-3">';
    for (var ci = 0; ci < cart.length; ci++) {
      html += '\
          <div class="c-flex-between c-mb-2">\
            <span class="text-secondary">' + utils.sanitizeHTML(utils.truncate(cart[ci].title, 20)) + ' \u00D7 ' + cart[ci].quantity + '</span>\
            <span>' + utils.formatCurrency((cart[ci].price || 0) * (cart[ci].quantity || 1)) + '</span>\
          </div>';
    }
    html += '\
        </div>\
        <div class="c-border-top c-pt-3">\
          <div class="flex items-center justify-between c-mb-1">\
            <span class="text-secondary c-fs-sm">Subtotal</span>\
            <span class="c-fs-sm">' + utils.formatCurrency(subtotal) + '</span>\
          </div>\
          ' + (discountAmount > 0 ? '\
          <div class="flex items-center justify-between c-mb-1">\
            <span class="text-accent-green c-fs-sm">Discount</span>\
            <span class="text-accent-green c-fs-sm">\u2212' + utils.formatCurrency(discountAmount) + '</span>\
          </div>' : '') + '\
          <div class="flex items-center justify-between c-mb-1">\
            <span class="text-secondary c-fs-sm">Shipping</span>\
            <span class="c-fs-sm">' + (shipping === 0 ? '<span class="text-accent-green">Free</span>' : utils.formatCurrency(shipping)) + '</span>\
          </div>\
          <div class="flex items-center justify-between c-mb-1">\
            <span class="text-secondary c-fs-sm">Tax (18%)</span>\
            <span class="c-fs-sm">' + utils.formatCurrency(tax) + '</span>\
          </div>\
          <div class="flex items-center justify-between c-pt-2 c-border-top c-mt-2">\
            <span class="font-semibold">Total</span>\
            <span class="price c-fs-lg">' + utils.formatCurrency(total) + '</span>\
          </div>\
        </div>\
      </div>\
    </div>\
  </div>\
</div>';
    mainContent.innerHTML = html;
  };

  window.renderPage.selectPayment = function(method) {
    store.set('paymentMethod', { method: method });
  };

  window.renderPage.proceedToPayment = function() {
    var name = document.getElementById('ship-name');
    var phone = document.getElementById('ship-phone');
    var address = document.getElementById('ship-address');
    var city = document.getElementById('ship-city');
    var state = document.getElementById('ship-state');
    var pin = document.getElementById('ship-pin');
    if (!name || !name.value.trim()) { showToast('Please enter your name', 'warning'); return; }
    if (!phone || !phone.value.trim()) { showToast('Please enter your phone number', 'warning'); return; }
    if (!address || !address.value.trim()) { showToast('Please enter your address', 'warning'); return; }
    if (!city || !city.value.trim()) { showToast('Please enter your city', 'warning'); return; }
    if (!state || !state.value.trim()) { showToast('Please enter your state', 'warning'); return; }
    if (!pin || !pin.value.trim()) { showToast('Please enter your pin code', 'warning'); return; }
    store.set('shippingAddress', { name: name.value.trim(), phone: phone.value.trim(), address: address.value.trim(), city: city.value.trim(), state: state.value.trim(), pin: pin.value.trim() });
    window.renderPage.checkoutStep('payment');
  };

  window.renderPage.placeOrder = function() {
    showToast('Order placed successfully! \u0040\u0040EMOJI_PARTY', 'success');
    window.renderPage.checkoutStep('confirmation');
  };
  function renderOrdersTab() {
    var orders = generateMockOrders();
    if (!orders || orders.length === 0) {
      return '\
  <div class="empty-state c-mt-8">\
    <div class="empty-state-icon">\u0040\u0040EMOJI_PACK</div>\
    <h2 class="empty-state-title">No Orders Yet</h2>\
    <p class="empty-state-text">You haven\'t placed any orders yet. Start shopping!</p>\
  </div>';
    }
    var html = '\
  <div class="c-flex-column c-flex-gap-4 c-mt-4">';
    for (var o = 0; o < orders.length; o++) {
      var ord = orders[o];
      var statusColors = { delivered: 'badge-green', processing: 'badge-blue', cancelled: 'badge-red' };
      var statusIcons = { delivered: '\u0040\u0040EMOJI_CHECKMARK', processing: '\u0040\u0040EMOJI_HOURGLASS', cancelled: '\u0040\u0040EMOJI_X' };
      var sc = statusColors[ord.status] || 'badge-blue';
      var si = statusIcons[ord.status] || '\u0040\u0040EMOJI_CLIP';
      var itemNames = [];
      for (var oi = 0; oi < ord.items.length; oi++) {
        itemNames.push(ord.items[oi].title);
      }
      html += '\
    <div class="content-card c-p-5" style="cursor:default">\
      <div class="c-flex-between c-mb-3">\
        <div class="c-flex c-flex-gap-3">\
          <span class="c-fs-lg">' + si + '</span>\
          <div>\
            <div class="font-semibold">Order ' + ord.id + '</div>\
            <div class="text-secondary text-sm">Placed on ' + ord.date + '</div>\
          </div>\
        </div>\
        <div class="badge ' + sc + '">' + ord.status.charAt(0).toUpperCase() + ord.status.slice(1) + '</div>\
      </div>\
      <div class="c-flex c-flex-wrap c-flex-gap-2 c-mb-3">';
      for (var oi2 = 0; oi2 < ord.items.length; oi2++) {
        var oItem = ord.items[oi2];
        html += '\
        <span class="badge c-bg-tertiary c-text-primary">' + oItem.title + ' \u00D7 ' + oItem.quantity + '</span>';
      }
      html += '\
      </div>\
      <div class="c-flex-between">\
        <span class="price c-fs-lg">' + utils.formatCurrency(ord.total) + '</span>\
        <button class="btn btn-secondary btn-sm" data-action="marketplace:showInvoice:' + ord.id + '">View Invoice</button>\
      </div>\
    </div>';
    }
    html += '\
  </div>';
    return html;
  }

  function renderDownloadsTab() {
    var mp = mockData.marketplace || [];
    var digital = [];
    for (var i = 0; i < mp.length; i++) {
      if (isDigitalProduct(mp[i].category)) {
        digital.push(mp[i]);
      }
    }
    var purchased = digital.slice(0, 5);
    if (!purchased || purchased.length === 0) {
      return '\
  <div class="empty-state c-mt-8">\
    <div class="empty-state-icon">\u0040\u0040EMOJI_DOWNLOAD</div>\
    <h2 class="empty-state-title">No Downloads Available</h2>\
    <p class="empty-state-text">Purchase digital products like courses and ebooks to access downloads.</p>\
  </div>';
    }
    var html = '\
  <div class="c-flex-column c-flex-gap-4 c-mt-4">';
    for (var d = 0; d < purchased.length; d++) {
      var dl = purchased[d];
      var fileSize = (Math.random() * 500 + 50).toFixed(1);
      var dlCount = Math.floor(Math.random() * 200) + 10;
      var grad = utils.getGradient(parseInt(dl.id.slice(1)) || d);
      html += '\
    <div class="content-card c-flex c-flex-gap-5 c-p-5" style="cursor:default">\
      <div class="c-flex-center c-fs-lg" style="width:56px;height:56px;border-radius:var(--radius-md);background:' + grad + ';flex-shrink:0">\u0040\u0040EMOJI_FILE</div>\
      <div style="flex:1;min-width:0">\
        <div class="font-semibold">' + utils.sanitizeHTML(dl.title) + '</div>\
        <div class="text-secondary text-sm">' + fileSize + ' MB \u2022 Downloaded ' + dlCount + ' times</div>\
      </div>\
      <button class="btn btn-primary btn-sm" data-action="marketplace:showToast:Downloading ' + utils.sanitizeHTML(dl.title) + '...:success">Download</button>\
    </div>';
    }
    html += '\
  </div>';
    return html;
  }

  window.renderPage.cart = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    var activeTab = (params && params.tab) || 'cart';
    var cart = store.get('cart') || [];
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
      subtotal += (cart[i].price || 0) * (cart[i].quantity || 1);
    }
    var appliedCoupon = store.get('appliedCoupon') || null;
    var discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discountAmount = Math.round(subtotal * appliedCoupon.discount / 100);
      } else {
        discountAmount = Math.min(appliedCoupon.discount, subtotal);
      }
    }
    var total = subtotal - discountAmount;
    var tabClass = 'btn btn-sm';
    var activeTabClass = 'btn btn-sm btn-primary';

    var html = '\
<div class="page-container-inner">\
  <div class="page-header">\
    <h1 class="page-title">Shopping</h1>\
    <div class="c-flex c-flex-gap-2">\
      <button class="' + (activeTab === 'cart' ? activeTabClass : tabClass) + '" data-action="marketplace:navigate:cart">\u0040\u0040EMOJI_CART Cart ' + (cart.length > 0 ? '(' + cart.length + ')' : '') + '</button>\
      <button class="' + (activeTab === 'orders' ? activeTabClass : tabClass) + '" data-action="marketplace:navigate:cart?tab=orders">\u0040\u0040EMOJI_PACK Orders</button>\
      <button class="' + (activeTab === 'downloads' ? activeTabClass : tabClass) + '" data-action="marketplace:navigate:cart?tab=downloads">\u0040\u0040EMOJI_DOWNLOAD Downloads</button>\
    </div>\
  </div>';

    if (activeTab === 'orders') {
      html += renderOrdersTab();
    } else if (activeTab === 'downloads') {
      html += renderDownloadsTab();
    } else {
      if (!cart || cart.length === 0) {
        html += '\
  <div class="empty-state">\
    <div class="empty-state-icon">\u0040\u0040EMOJI_CART</div>\
    <h2 class="empty-state-title">Your Cart is Empty</h2>\
    <p class="empty-state-text">Looks like you haven\'t added anything to your cart yet.</p>\
    <button class="btn btn-primary" data-action="marketplace:navigate:marketplace">Start Shopping</button>\
  </div>';
      } else {
        html += '\
  <div class="c-grid" style="grid-template-columns:1fr 360px;gap:var(--space-8)">\
    <div>\
      <div class="c-flex-col c-flex-gap-4">';
        for (var ci = 0; ci < cart.length; ci++) {
          var cartItem = cart[ci];
          var itemTotal = (cartItem.price || 0) * (cartItem.quantity || 1);
          var gradient = utils.getGradient(parseInt((cartItem.id || '0').slice(1)) || ci);
          html += '\
        <div class="content-card c-flex c-flex-gap-5 c-p-5" style="cursor:default">\
          <div class="c-flex-center c-fs-lg" style="width:80px;height:80px;border-radius:var(--radius-md);background:' + gradient + ';font-size:2rem;flex-shrink:0">\u0040\u0040EMOJI_PACK</div>\
          <div style="flex:1;min-width:0">\
            <div class="font-semibold">' + utils.sanitizeHTML(cartItem.title || 'Product') + '</div>\
            <div class="text-secondary text-sm">' + utils.formatCurrency(cartItem.price || 0) + ' each</div>\
          </div>\
          <div class="c-flex c-flex-gap-3">\
            <button class="btn btn-ghost btn-sm c-flex-center" style="width:32px;height:32px" data-action="marketplace:updateCartQty:' + cartItem.id + ':' + (cartItem.quantity - 1) + '">\u2212</button>\
            <span class="font-semibold">' + cartItem.quantity + '</span>\
            <button class="btn btn-ghost btn-sm c-flex-center" style="width:32px;height:32px" data-action="marketplace:updateCartQty:' + cartItem.id + ':' + (cartItem.quantity + 1) + '">+</button>\
          </div>\
          <div class="price c-text-right" style="min-width:80px">' + utils.formatCurrency(itemTotal) + '</div>\
          <button class="btn btn-ghost c-text-danger c-fs-base" data-action="marketplace:removeFromCart:' + cartItem.id + '">\u2715</button>\
        </div>';
        }
        html += '\
      </div>\
    </div>\
    <div>\
      <div class="stat-card" style="position:sticky;top:var(--space-6)">\
        <h3 class="font-semibold c-mb-4">Coupon Code</h3>\
        <div class="flex gap-2 c-mb-6">\
          <input type="text" class="input-field" id="coupon-input" placeholder="Enter code" value="' + (appliedCoupon ? appliedCoupon.code : '') + '" ' + (appliedCoupon ? 'readonly' : '') + '>\
          ' + (appliedCoupon ? '<button class="btn btn-ghost c-text-danger" data-action="marketplace:removeCoupon">Remove</button>' : '<button class="btn btn-primary" data-action="marketplace:applyCoupon">Apply</button>') + '\
        </div>\
        ' + (appliedCoupon ? '<div class="badge badge-green c-mb-4">Coupon ' + appliedCoupon.code + ' applied! ' + (appliedCoupon.type === 'percentage' ? appliedCoupon.discount + '% off' : '₹' + appliedCoupon.discount + ' off') + '</div>' : '') + '\
        <div class="c-border-top c-pt-4 c-mb-4">\
          <div class="flex items-center justify-between c-mb-2">\
            <span class="text-secondary">Subtotal</span>\
            <span class="font-semibold">' + utils.formatCurrency(subtotal) + '</span>\
          </div>\
          ' + (discountAmount > 0 ? '\
          <div class="flex items-center justify-between c-mb-2">\
            <span class="text-accent-green">Discount</span>\
            <span class="text-accent-green">\u2212' + utils.formatCurrency(discountAmount) + '</span>\
          </div>' : '') + '\
          <div class="flex items-center justify-between c-pt-3 c-border-top">\
            <span class="font-semibold c-fs-lg">Total</span>\
            <span class="price c-fs-xl">' + utils.formatCurrency(total) + '</span>\
          </div>\
        </div>\
        <button class="btn btn-primary c-w-full" data-action="marketplace:checkout">Proceed to Checkout</button>\
      </div>\
    </div>\
  </div>';
      }
    }
    html += '\
</div>';
    mainContent.innerHTML = html;
  };

  window.renderPage.updateCartQty = function(id, qty) {
    if (qty < 1) { window.renderPage.removeFromCart(id); return; }
    var cart = store.get('cart') || [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { cart[i].quantity = qty; break; }
    }
    store.set('cart', cart);
    window.renderPage.cart();
  };

  window.renderPage.removeFromCart = function(id) {
    var cart = store.get('cart') || [];
    var idx = -1;
    for (var i = 0; i < cart.length; i++) { if (cart[i].id === id) { idx = i; break; } }
    if (idx > -1) cart.splice(idx, 1);
    store.set('cart', cart);
    if (cart.length === 0) store.set('appliedCoupon', null);
    showToast('Removed from cart', 'info');
    window.renderPage.cart();
  };

  window.renderPage.applyCoupon = function() {
    var input = document.getElementById('coupon-input');
    if (!input) return;
    var code = input.value.trim();
    if (!code) return;
    api.applyCoupon(code).then(function(res) {
      if (res.success) {
        store.set('appliedCoupon', res.data);
        showToast('Coupon applied! ' + (res.data.type === 'percentage' ? res.data.discount + '% off' : '₹' + res.data.discount + ' off'), 'success');
        window.renderPage.cart();
      } else {
        showToast(res.error || 'Invalid coupon', 'error');
      }
    });
  };

  window.renderPage.removeCoupon = function() {
    store.set('appliedCoupon', null);
    showToast('Coupon removed', 'info');
    window.renderPage.cart();
  };

  window.renderPage.checkout = function() {
    var cart = store.get('cart') || [];
    if (!cart || cart.length === 0) { showToast('Your cart is empty', 'warning'); return; }
    window.renderPage.checkoutStep('shipping');
  };

  window.renderPage.showTrackingTimeline = function(order) {
    var statuses = ['processing', 'shipped', 'out-for-delivery', 'delivered'];
    var statusLabels = ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered'];
    var statusDates = [];
    var baseDate = new Date(order.date);
    for (var sti = 0; sti < statuses.length; sti++) {
      var d = new Date(baseDate);
      d.setDate(d.getDate() + sti * 2 + 1);
      statusDates.push(d.toISOString().split('T')[0]);
    }
    var currentIdx = statuses.indexOf(order.status);
    if (currentIdx === -1) currentIdx = order.status === 'delivered' ? 3 : order.status === 'shipped' ? 1 : 0;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    var html = '\
<div class="modal" style="max-width:600px;width:90%">\
  <div class="modal-header">\
    <h3 class="c-fs-xl c-flex c-flex-gap-2"><span>\u0040\u0040EMOJI_DELIVERY</span> Track Order ' + order.id + '</h3>\
    <button class="btn btn-ghost" data-action="marketplace:closeModal">\u2715</button>\
  </div>\
  <div class="modal-body">\
    <div class="c-mb-6" style="position:relative;padding-left:var(--space-6)">';
    for (var sti2 = 0; sti2 < statusLabels.length; sti2++) {
      var isDone = sti2 <= currentIdx;
      var isCurrent = sti2 === currentIdx;
      html += '\
      <div style="position:relative;padding-bottom:var(--space-4)">\
        <div style="position:absolute;left:-24px;top:0;width:28px;height:28px;border-radius:50%;background:' + (isDone ? 'var(--accent-green)' : 'var(--bg-tertiary)') + ';display:flex;align-items:center;justify-content:center;font-size:12px;color:' + (isDone ? '#fff' : 'var(--text-secondary)') + ';z-index:2;' + (isCurrent ? 'box-shadow:0 0 0 4px rgba(16,185,129,0.2)' : '') + '">' + (isDone ? '\u2713' : '') + '</div>\
        ' + (sti2 < statusLabels.length - 1 ? '<div style="position:absolute;left:-11px;top:28px;width:2px;height:calc(100% - 28px);background:' + (isDone && sti2 < currentIdx ? 'var(--accent-green)' : 'var(--bg-tertiary)') + ';z-index:1"></div>' : '') + '\
        <div style="margin-left:var(--space-3)">\
          <div class="c-fs-sm c-fw-semibold" style="color:' + (isDone ? 'var(--text-primary)' : 'var(--text-secondary)') + '">' + statusLabels[sti2] + '</div>\
          ' + (isDone ? '<div class="c-fs-xs c-text-secondary">' + statusDates[sti2] + '</div>' : '') + '\
        </div>\
      </div>';
    }
    html += '\
    </div>\
    <div class="c-flex-center c-gap-3 c-mt-4 c-pt-4 c-border-top">\
      <div class="c-flex c-flex-gap-1 c-fs-xs c-text-secondary">\
        <span>Order ID: ' + order.id + '</span>\
        <span>|</span>\
        <span>Placed: ' + order.date + '</span>\
      </div>\
    </div>\
  </div>\
</div>';
    overlay.innerHTML = html;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  };

  function renderOrdersTab() {
    var orders = generateMockOrders();
    if (!orders || orders.length === 0) {
      return '\
  <div class="empty-state c-mt-8">\
    <div class="empty-state-icon">\u0040\u0040EMOJI_PACK</div>\
    <h2 class="empty-state-title">No Orders Yet</h2>\
    <p class="empty-state-text">You haven\'t placed any orders yet. Start shopping!</p>\
    <button class="btn btn-primary" data-action="marketplace:navigate:marketplace">Start Shopping</button>\
  </div>';
    }
    function renderInvoiceId(oid) {
      return 'INV-' + oid;
    }
    var html = '\
  <div class="c-flex-column c-flex-gap-4 c-mt-4">';
    for (var o = 0; o < orders.length; o++) {
      var ord = orders[o];
      var statusColors = { delivered: 'badge-green', processing: 'badge-blue', shipped: 'badge-warning', cancelled: 'badge-red' };
      var statusIcons = { delivered: '\u0040\u0040EMOJI_CHECKMARK', processing: '\u0040\u0040EMOJI_HOURGLASS', shipped: '\u0040\u0040EMOJI_DELIVERY', cancelled: '\u0040\u0040EMOJI_X' };
      var sc = statusColors[ord.status] || 'badge-blue';
      var si = statusIcons[ord.status] || '\u0040\u0040EMOJI_CLIP';
      var itemNames = [];
      for (var oi = 0; oi < ord.items.length; oi++) {
        itemNames.push(ord.items[oi].title);
      }
      html += '\
    <div class="content-card c-p-5" style="cursor:default">\
      <div class="c-flex-between c-mb-3">\
        <div class="c-flex c-flex-gap-3">\
          <span class="c-fs-lg">' + si + '</span>\
          <div>\
            <div class="c-fw-semibold c-fs-sm">Order ' + ord.id + '</div>\
            <div class="c-fs-xs c-text-secondary">Placed on ' + ord.date + '</div>\
          </div>\
        </div>\
        <div class="c-flex c-flex-gap-2" style="align-items:center">\
          <span class="badge ' + sc + '">' + ord.status.charAt(0).toUpperCase() + ord.status.slice(1) + '</span>\
          <span class="c-fs-xs c-text-secondary">Invoice: ' + renderInvoiceId(ord.id) + '</span>\
        </div>\
      </div>\
      <div class="c-flex c-flex-wrap c-flex-gap-2 c-mb-3">';
      for (var oi2 = 0; oi2 < ord.items.length; oi2++) {
        var oItem = ord.items[oi2];
        html += '\
        <span class="badge c-bg-tertiary c-text-primary c-fs-xs">' + oItem.title + ' \u00D7 ' + oItem.quantity + '</span>';
      }
      html += '\
      </div>\
      <div class="c-flex-between">\
        <div class="c-flex c-flex-gap-3">\
          <span class="price c-fs-lg c-fw-bold">' + utils.formatCurrency(ord.total) + '</span>\
          <span class="c-text-secondary c-fs-xs" style="align-self:center">(' + ord.items.length + ' item' + (ord.items.length !== 1 ? 's' : '') + ')</span>\
        </div>\
        <div class="c-flex c-flex-gap-2">\
          <button class="btn btn-secondary btn-sm" data-action="marketplace:showInvoice:' + ord.id + '">\u0040\u0040EMOJI_FILE Invoice</button>\
          ' + (ord.status !== 'cancelled' ? '<button class="btn btn-primary btn-sm" data-action="marketplace:trackOrder:' + ord.id + '">\u0040\u0040EMOJI_DELIVERY Track Order</button>' : '') + '\
        </div>\
      </div>\
    </div>';
    }
    html += '\
  </div>';
    return html;
  }

  window.renderPage.trackOrder = function(orderId) {
    var orders = getOrders();
    var order = null;
    for (var ti = 0; ti < orders.length; ti++) {
      if (orders[ti].id === orderId) { order = orders[ti]; break; }
    }
    if (!order) { showToast('Order not found', 'error'); return; }
    window.renderPage.showTrackingTimeline(order);
  };

  window.renderPage.showInvoice = function(orderId) {
    var orders = getOrders();
    var order = null;
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === orderId) { order = orders[i]; break; }
    }
    if (!order) { showToast('Order not found', 'error'); return; }
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '\
<div class="modal" style="max-width:700px;width:90%">\
  <div class="modal-header c-bg-secondary" style="border-bottom:2px solid var(--accent-blue)">\
    <h3 class="c-fs-xl c-flex c-flex-gap-2"><span class="c-fs-lg">\u0040\u0040EMOJI_FILE</span> Invoice #' + order.id + '</h3>\
    <button class="btn btn-ghost" data-action="marketplace:closeModal">\u2715</button>\
  </div>\
  <div class="modal-body c-p-8" style="background:white;color:#1a1a2e">\
    <div class="c-flex-between c-mb-6" style="align-items:flex-start;padding-bottom:var(--space-6);border-bottom:2px solid #e5e7eb">\
      <div>\
        <div class="c-fw-bold c-mb-1" style="font-size:var(--text-2xl);color:#1a1a2e">EduMentee</div>\
        <div class="c-fs-sm" style="color:#6b7280">123 Education Lane, Learning City</div>\
        <div class="c-fs-sm" style="color:#6b7280">contact@edumentee.com | +91 98765 43210</div>\
      </div>\
      <div class="c-text-right">\
        <div class="c-fs-lg c-fw-bold" style="color:#1a1a2e">INVOICE</div>\
        <div class="c-fs-sm" style="color:#6b7280">#' + order.id + '</div>\
        <div class="c-fs-sm" style="color:#6b7280">Date: ' + order.date + '</div>\
      </div>\
    </div>\
    <div class="c-mb-6" style="padding-bottom:var(--space-6);border-bottom:2px solid #e5e7eb">\
      <div class="c-fw-semibold c-mb-2" style="color:#1a1a2e">Bill To:</div>\
      <div class="c-fs-sm" style="color:#6b7280">' + order.billing.name + '</div>\
      <div class="c-fs-sm" style="color:#6b7280">' + order.billing.address + '</div>\
      <div class="c-fs-sm" style="color:#6b7280">' + order.billing.email + '</div>\
      <div class="c-fs-sm" style="color:#6b7280">' + order.billing.phone + '</div>\
    </div>\
    <table class="c-w-full c-mb-6" style="border-collapse:collapse">\
      <thead>\
        <tr style="background:#f3f4f6">\
          <th class="c-p-3 c-text-left c-fs-sm c-fw-semibold" style="color:#374151">Item</th>\
          <th class="c-p-3 c-text-center c-fs-sm c-fw-semibold" style="color:#374151">Qty</th>\
          <th class="c-p-3 c-text-right c-fs-sm c-fw-semibold" style="color:#374151">Price</th>\
          <th class="c-p-3 c-text-right c-fs-sm c-fw-semibold" style="color:#374151">Total</th>\
        </tr>\
      </thead>\
      <tbody>';
    for (var ii = 0; ii < order.items.length; ii++) {
      var line = order.items[ii];
      var lineTotal = line.price * line.quantity;
      overlay.innerHTML += '\
        <tr style="border-bottom:1px solid #e5e7eb">\
          <td class="c-p-3 c-fs-sm" style="color:#374151">' + line.title + '</td>\
          <td class="c-p-3 c-text-center c-fs-sm" style="color:#374151">' + line.quantity + '</td>\
          <td class="c-p-3 c-text-right c-fs-sm" style="color:#374151">₹' + line.price + '</td>\
          <td class="c-p-3 c-text-right c-fs-sm c-fw-semibold" style="color:#374151">₹' + lineTotal + '</td>\
        </tr>';
    }
    overlay.innerHTML += '\
      </tbody>\
    </table>\
    <div class="c-flex-col c-flex-end c-flex-gap-2 c-pt-4" style="align-items:flex-end;border-top:2px solid #e5e7eb">\
      <div class="c-flex-between" style="width:240px">\
        <span class="c-fs-sm" style="color:#6b7280">Subtotal</span>\
        <span class="c-fs-sm c-fw-semibold" style="color:#374151">₹' + order.subtotal + '</span>\
      </div>\
      ' + (order.discount > 0 ? '<div class="c-flex-between" style="width:240px"><span class="c-fs-sm" style="color:#10b981">Discount</span><span class="c-fs-sm" style="color:#10b981">\u2212₹' + order.discount + '</span></div>' : '') + '\
      <div class="c-flex-between" style="width:240px">\
        <span class="c-fs-sm" style="color:#6b7280">Tax (18%)</span>\
        <span class="c-fs-sm c-fw-semibold" style="color:#374151">₹' + order.tax + '</span>\
      </div>\
      <div class="c-flex-between c-pt-3 c-mt-2" style="width:240px;border-top:2px solid #1a1a2e">\
        <span class="c-fs-base c-fw-bold" style="color:#1a1a2e">Total</span>\
        <span class="c-fs-lg c-fw-bold" style="color:#1a1a2e">₹' + order.total + '</span>\
      </div>\
    </div>\
    <div class="c-text-center c-mt-8 c-pt-6" style="border-top:1px solid #e5e7eb">\
      <div class="c-fs-sm" style="color:#6b7280">Thank you for your purchase!</div>\
      <div class="c-fs-xs c-mt-1" style="color:#9ca3af">This is a computer-generated invoice.</div>\
    </div>\
  </div>\
  <div class="modal-footer c-flex-end c-flex-gap-3">\
    <button class="btn btn-secondary" data-action="marketplace:showToast:PDF downloaded successfully!:success">\u0040\u0040EMOJI_DOWNLOAD Download PDF</button>\
    <button class="btn btn-primary" data-action="marketplace:closeModal">Close</button>\
  </div>\
</div>';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  };
  var ms = document.createElement('style');
  ms.textContent =
    '.product-card { height:100%;display:flex;flex-direction:column;border:1px solid var(--border-color); }' +
    '.product-card:hover { border-color:var(--accent-blue);box-shadow:0 4px 16px rgba(6,182,212,0.12);transform:translateY(-2px); }' +
    '.product-image { flex-shrink:0;height:180px;display:flex;align-items:center;justify-content:center }' +
    '.product-body { flex:1;display:flex;flex-direction:column; }' +
    '.product-footer { margin-top:auto; }' +
    '.marketplace-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4); }' +
    '@media (max-width:1024px) { .marketplace-grid { grid-template-columns:repeat(2,1fr); } }' +
    '@media (max-width:600px) { .marketplace-grid { grid-template-columns:1fr; } .top-bar { flex-direction:column; } .top-bar-search { max-width:100%; } }' +
    '.category-nav-btn:hover { opacity:0.85; }' +
    '.top-bar-badge { animation:badgePop 0.3s ease-out; }' +
    '@keyframes badgePop { 0% { transform:scale(0); } 70% { transform:scale(1.2); } 100% { transform:scale(1); } }' +
    '.wishlist-heart-btn:hover { transform:scale(1.15); }';
  document.head.appendChild(ms);
})();


