document.addEventListener('DOMContentLoaded', function(){
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const selectAll = document.getElementById('selectAll');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function loadCart(){
    try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){return [];}
  }
  function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); window.dispatchEvent(new Event('storage')); }

  function render(){
    const cart = loadCart();
    cartList.innerHTML = '';
    if(!cart.length){
      cartList.innerHTML = '<p>购物车为空，去首页挑选商品吧。</p>';
      if(cartTotal) cartTotal.textContent = '¥0.00';
      return;
    }
    cart.forEach(item=>{
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <input type="checkbox" class="item-checkbox" data-id="${item.id}">
        <img src="${item.image}" alt="">
        <div class="info">
          <div class="name">${item.title}</div>
          <div>单价：<span class="price">¥${item.unitPrice}</span> × ${item.qty}</div>
        </div>
        <button class="delete-btn" data-id="${item.id}" title="删除" style="background:none;border:none;color:#c33;cursor:pointer;font-size:18px">✕</button>
      `;
      cartList.appendChild(row);
    });

    // attach events
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb=>cb.addEventListener('change', updateTotal));
    if(selectAll){
      selectAll.checked = false;
      selectAll.onchange = function(){
        document.querySelectorAll('.item-checkbox').forEach(cb=>cb.checked = selectAll.checked);
        updateTotal();
      };
    }

    // delete buttons
    const dels = document.querySelectorAll('.delete-btn');
    dels.forEach(btn=>btn.addEventListener('click', function(){
      const id = Number(btn.dataset.id);
      let cart = loadCart();
      cart = cart.filter(i=>Number(i.id)!==id);
      saveCart(cart);
      render();
    }));

    updateTotal();
  }

  function updateTotal(){
    const cart = loadCart();
    let total = 0;
    document.querySelectorAll('.item-checkbox').forEach(cb=>{
      if(cb.checked){
        const id = Number(cb.dataset.id);
        const it = cart.find(x=>Number(x.id)===id);
        if(it) total += parseFloat(it.unitPrice) * Number(it.qty);
      }
    });
    if(cartTotal) cartTotal.textContent = '¥' + total.toFixed(2);
  }

  if(checkoutBtn){
    checkoutBtn.addEventListener('click', function(){
      const totalNum = parseFloat((cartTotal && cartTotal.textContent||'').replace(/[¥,\s]/g,'')) || 0;
      if(totalNum === 0){
        alert('请选择要结算的商品');
        return;
      }
      alert('结算总额 ' + '¥' + totalNum.toFixed(2) + '（示例行为）');
    });
  }

  // remove item on double click (optional)
  cartList.addEventListener('dblclick', function(e){
    const row = e.target.closest('.cart-item');
    if(!row) return;
    const cb = row.querySelector('.item-checkbox');
    if(!cb) return;
    const id = Number(cb.dataset.id);
    let cart = loadCart();
    cart = cart.filter(i=>Number(i.id)!==id);
    saveCart(cart);
    render();
  });

  // initial
  render();
});
