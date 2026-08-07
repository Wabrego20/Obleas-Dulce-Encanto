const products = [
  {id:1,name:"Clásica",desc:"Arequipe, queso y un toque de coco.",price:4.50,emoji:"🥞"},
  {id:2,name:"Fresa & Chocolate",desc:"Nutella, fresas frescas y chispas de chocolate.",price:5.75,emoji:"🍓"},
  {id:3,name:"Banano Crunch",desc:"Arequipe, banano, chocolate y galleta.",price:5.25,emoji:"🍌"},
  {id:4,name:"Dulce Coco",desc:"Arequipe, coco rallado y chocolate blanco.",price:5.00,emoji:"🥥"},
  {id:5,name:"Triple Chocolate",desc:"Chocolate, Nutella y lluvia de chocolate.",price:5.90,emoji:"🍫"},
  {id:6,name:"Frutal",desc:"Arequipe, fresas, banano y un toque de miel.",price:5.50,emoji:"🍯"}
];

let cart = JSON.parse(localStorage.getItem("obleasCart") || "[]");

const productsEl = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function money(n){ return `$${n.toFixed(2)}`; }

function renderProducts(){
  productsEl.innerHTML = products.map(p => `
    <article class="product">
      <div class="product-img">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="product-bottom">
        <span class="price">${money(p.price)}</span>
        <button class="small-btn" onclick="addProduct(${p.id})">Agregar</button>
      </div>
    </article>
  `).join("");
}

function saveCart(){ localStorage.setItem("obleasCart", JSON.stringify(cart)); updateCart(); }

function addProduct(id){
  const p = products.find(x => x.id === id);
  cart.push({name:p.name, detail:p.desc, price:p.price});
  saveCart(); showToast(`${p.name} agregada al carrito ✓`);
}

function updateCart(){
  cartCount.textContent = cart.length;
  if(!cart.length){
    cartItems.innerHTML = '<p style="text-align:center;padding:25px;color:#80685c">Tu carrito está vacío.</p>';
  } else {
    cartItems.innerHTML = cart.map((item,i)=>`
      <div class="cart-item">
        <div><strong>${item.name}</strong><small>${item.detail || ""}</small></div>
        <div><strong>${money(item.price)}</strong><br><button class="remove" onclick="removeItem(${i})">Eliminar</button></div>
      </div>
    `).join("");
  }
  const total = cart.reduce((sum,item)=>sum+item.price,0);
  cartTotal.textContent = money(total);
}

function removeItem(i){ cart.splice(i,1); saveCart(); }

function showToast(text){
  toast.textContent=text; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}

document.getElementById("cartButton").onclick=()=>cartModal.classList.add("open");
document.getElementById("closeCart").onclick=()=>cartModal.classList.remove("open");
cartModal.addEventListener("click",e=>{if(e.target===cartModal)cartModal.classList.remove("open")});

document.getElementById("checkout").onclick=()=>{
  if(!cart.length){showToast("Agrega una oblea primero.");return;}
  const total=cart.reduce((s,i)=>s+i.price,0);
  const text=`Hola, quiero hacer un pedido en Obleas Dulce Encanto.\n\n${cart.map(i=>`• ${i.name} - ${money(i.price)}`).join("\n")}\n\nTotal: ${money(total)}`;
  window.open(`https://wa.me/50768035103?text=${encodeURIComponent(text)}`,"_blank");
};

function updateCustomizer(){
  const filling=document.querySelector('input[name="filling"]:checked');
  const toppings=[...document.querySelectorAll(".topping:checked")];
  const base=2.50;
  const total=base+Number(filling.dataset.price)+toppings.reduce((s,x)=>s+Number(x.dataset.price),0);
  document.getElementById("customTotal").textContent=money(total);
  document.getElementById("selectionText").textContent=[filling.value,...toppings.map(x=>x.value)].join(" · ");
  return {total,detail:[filling.value,...toppings.map(x=>x.value)].join(", ")};
}
document.querySelectorAll("#personaliza input").forEach(i=>i.addEventListener("change",updateCustomizer));
document.getElementById("addCustom").onclick=()=>{
  const {total,detail}=updateCustomizer();
  cart.push({name:"Oblea personalizada",detail,price:total});
  saveCart(); showToast("Tu oblea personalizada fue agregada ✓");
};

document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  showToast("¡Mensaje enviado! Gracias por contactarnos.");
  e.target.reset();
});

document.querySelector(".menu-btn").onclick=()=>document.querySelector(".nav").classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".nav").classList.remove("open")));

renderProducts();
updateCart();
updateCustomizer();
