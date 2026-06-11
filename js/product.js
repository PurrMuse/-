document.addEventListener('DOMContentLoaded', function () {
  const priceEl = document.getElementById('price');
  const storageOptions = document.getElementById('storageOptions');
  const colorOptions = document.getElementById('colorOptions');
  const qtyInput = document.getElementById('qtyInput');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyMinus = document.getElementById('qtyMinus');
  const mainImage = document.getElementById('mainImage');
  const productTitleEl = document.querySelector('.product-title');

  function getActiveStoragePrice() {
    const active = storageOptions.querySelector('.option.active');
    return active ? Number(active.dataset.price) : 0;
  }

  function updatePrice() {
    const unit = getActiveStoragePrice();
    let qty = parseInt(qtyInput.value, 10) || 1;
    if (qty < 1) qty = 1;
    priceEl.textContent = '¥' + (unit * qty);
  }

  // storage option clicks
  storageOptions.addEventListener('click', function (e) {
    const btn = e.target.closest('.option');
    if (!btn) return;
    storageOptions.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
    btn.classList.add('active');
    updatePrice();
  });

  // cart helpers
  function loadCart(){ try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){return [];} }
  function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); window.dispatchEvent(new Event('storage')); }


  function addToCart() {
    const unit = getActiveStoragePrice() || (function(){
      const p = priceEl.textContent.replace(/[¥,\s]/g,'');
      const qty = parseInt(qtyInput.value,10)||1;
      return Math.round((Number(p)||0)/qty);
    })();
    const qty = parseInt(qtyInput.value,10) || 1;
    const item = {
      id: Date.now(),
      image: mainImage.src,
      title: productTitleEl ? productTitleEl.textContent.trim() : '商品',
      unitPrice: unit,
      qty: qty
    };
    const cart = loadCart();
    cart.push(item);
    saveCart(cart);
  }

  // bind add-to-cart and buy-now
  const addCartBtn = document.querySelector('.add-cart');
  const buyNowBtn = document.querySelector('.buy-now');
  if(addCartBtn){
    addCartBtn.addEventListener('click', function(){
      addToCart();
      // redirect to cart
      location.href = 'cart.html';
    });
  }
  if(buyNowBtn){
    buyNowBtn.addEventListener('click', function(){
      addToCart();
      location.href = 'cart.html';
    });
  }

  // color option clicks
  colorOptions.addEventListener('click', function (e) {
    const btn = e.target.closest('.option');
    if (!btn) return;
    colorOptions.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
    btn.classList.add('active');
    const imageName = btn.dataset.image || '';
    if (imageName) {
      mainImage.src = `images/${imageName}.jpg`;
    }
  });

  // quantity controls
  qtyPlus.addEventListener('click', function () {
    let v = parseInt(qtyInput.value, 10) || 1;
    v++;
    qtyInput.value = v;
    updatePrice();
  });
  qtyMinus.addEventListener('click', function () {
    let v = parseInt(qtyInput.value, 10) || 1;
    v = Math.max(1, v - 1);
    qtyInput.value = v;
    updatePrice();
  });

  qtyInput.addEventListener('change', function () {
    let v = parseInt(qtyInput.value, 10) || 1;
    if (v < 1) v = 1;
    qtyInput.value = v;
    updatePrice();
  });

  // initialize price on load
  updatePrice();
});
