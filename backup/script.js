// ProDealsDZ - front-end only demo (HTML/CSS/JS)
// المنتجات (عينة)
const PRODUCTS = [
  { id: 'p1', title: 'قالب موقع احترافي', desc: 'قالب HTML/CSS بسيط وسهل التخصيص', price: 1200 },
  { id: 'p2', title: 'دورة برمجة جافاسكربت', desc: 'دورة مكثفة للمبتدئين', price: 2500 },
  { id: 'p3', title: 'كتاب إلكتروني: تسويق رقمي', desc: 'دليل عملي للتسويق عبر الإنترنت', price: 800 },
  { id: 'p4', title: 'مؤثرات صوتية لمواقع', desc: 'حزمة مؤثرات بجودة عالية', price: 400 }
];

const cart = [];

function qs(sel){return document.querySelector(sel)}
function qsa(sel){return document.querySelectorAll(sel)}

function format(num){return Number(num).toLocaleString('fr-FR')}

function renderProducts(list = PRODUCTS){
  const grid = qs('.products-grid');
  grid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="product-thumb">${p.title.split(' ')[0]}</div>
      <h4 class="product-title">${p.title}</h4>
      <p class="product-desc">${p.desc}</p>
      <div class="price">${format(p.price)} دج</div>
      <div class="actions">
        <button class="btn" data-buy="${p.id}">أضف للسلة</button>
        <button class="btn primary" data-buy-now="${p.id}">اشترِ الآن</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateCartCount(){
  qs('#cartCount').textContent = cart.length;
  qs('#cartTotal').textContent = format(cart.reduce((s,i)=>s+i.price,0));
  qs('#checkoutBtn').disabled = cart.length===0;
}

function addToCart(productId){
  const prod = PRODUCTS.find(p=>p.id===productId);
  if(prod){
    cart.push(prod);
    showToast('أضيف إلى السلة: ' + prod.title);
    updateCartCount();
  }
}

function openModal(id){
  const modal = qs(id);
  modal.setAttribute('aria-hidden','false');
}

function closeModal(el){
  const modal = el.closest('.modal');
  modal.setAttribute('aria-hidden','true');
}

function renderCartItems(){
  const box = qs('#cartItems');
  if(cart.length===0){
    box.innerHTML = '<p class="small">السلة فارغة.</p>';
    return;
  }
  box.innerHTML = '';
  cart.forEach((it,idx)=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <strong>${it.title}</strong>
        <div class="small">${it.desc}</div>
      </div>
      <div style="text-align:left">
        <div class="price">${format(it.price)} دج</div>
        <button class="btn" data-remove="${idx}">حذف</button>
      </div>
    </div>`;
    box.appendChild(div);
  });
}

function showToast(msg){
  const t = qs('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

// Event bindings
document.addEventListener('click', (e)=>{
  if(e.target.matches('[data-buy]')){
    addToCart(e.target.getAttribute('data-buy'));
  } else if(e.target.matches('[data-buy-now]')){
    addToCart(e.target.getAttribute('data-buy-now'));
    qs('#cartBtn').click();
  } else if(e.target.matches('#cartBtn')){
    renderCartItems();
    openModal('#cartModal');
  } else if(e.target.matches('[data-close]') || e.target.matches('.close')){
    closeModal(e.target);
  } else if(e.target.matches('[data-remove]')){
    const idx = Number(e.target.getAttribute('data-remove'));
    cart.splice(idx,1);
    renderCartItems();
    updateCartCount();
  } else if(e.target.matches('#checkoutBtn')){
    openModal('#checkoutModal');
  }
});

// search
qs('#search').addEventListener('input', (e)=>{
  const q = e.target.value.trim();
  if(!q) return renderProducts();
  const filtered = PRODUCTS.filter(p=> (p.title + ' ' + p.desc).toLowerCase().includes(q.toLowerCase()));
  renderProducts(filtered);
});

// checkout form (simulated)
qs('#checkoutForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  // Validate basic fields
  const name = qs('#cardName').value.trim();
  const number = qs('#cardNumber').value.replace(/\s+/g,'');
  const exp = qs('#cardExp').value.trim();
  const cvv = qs('#cardCVV').value.trim();

  if(!name || number.length!==16 || !/^[0-9]{4}\/[0-9]{2}$/.test(exp.replace('/','/')) && !/^[0-9]{2}\/[0-9]{2}$/.test(exp) || (cvv.length<3 || cvv.length>4)){
    alert('تحقق من بيانات البطاقة. (التأكد: رقم 16 خانة، MM/YY، CVV 3-4 أرقام)');
    return;
  }

  // Simulate processing...
  closeModal(qs('#checkoutForm').closest('.modal').querySelector('.close'));
  closeModal(qs('#cartModal').closest('.modal').querySelector('.close'));
  showToast('تمت عملية الدفع بنجاح — شكرًا لثقتك!');
  cart.length = 0; // clear
  updateCartCount();
});

// init
renderProducts();
updateCartCount();
qs('#year').textContent = new Date().getFullYear();
