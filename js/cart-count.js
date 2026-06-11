function updateCartCount(){
  try{
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const el = document.getElementById('cartCount');
    if(el) el.textContent = cart.length;
  }catch(e){}
}
window.addEventListener('storage', updateCartCount);
document.addEventListener('DOMContentLoaded', updateCartCount);
