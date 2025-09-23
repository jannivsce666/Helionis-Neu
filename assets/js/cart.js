// Unified Shopping Cart System
// Consolidates legacy keys and multiple addToCart implementations
// Single source of truth key
const CART_KEY = 'helionis_cart';
const LEGACY_KEYS = ['helionis-cart','cart'];

function migrateLegacyCarts(){
    let base = JSON.parse(localStorage.getItem(CART_KEY)||'[]');
    let changed = false;
    LEGACY_KEYS.forEach(k=>{
        const raw = localStorage.getItem(k);
        if(raw){
            try {
                const arr = JSON.parse(raw);
                if(Array.isArray(arr)){
                    arr.forEach(item=>{
                        if(!item || !item.id) return;
                        const existing = base.find(x=>x.id===item.id);
                        if(existing){ existing.quantity = (existing.quantity||1)+(item.quantity||1); }
                        else base.push(item);
                        changed = true;
                    });
                }
            } catch(e){ console.warn('Legacy cart parse error for', k, e); }
            localStorage.removeItem(k);
        }
    });
    if(changed) localStorage.setItem(CART_KEY, JSON.stringify(base));
    return base;
}

let cart = migrateLegacyCarts();

// Base product catalog (IDs) – extend as needed
const PRODUCT_CATALOG = {
    1: { id:1, name:'Schutz-Amulett "Aegis"', price:89.90, image:'assets/images/products/amulett-schutz.svg' },
    2: { id:2, name:'Kristallpyramide "Lumina"', price:149.90, image:'assets/images/products/pyramide-kristall.svg' },
    3: { id:3, name:'Orakeldeck "Visions"', price:49.90, image:'assets/images/products/orakel-deck.svg' }
};

// Normalized save
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function emitCartEvent(){ document.dispatchEvent(new CustomEvent('cartUpdated',{detail:cart})); }

function syncCartCount(){
    const el = document.getElementById('cart-count');
    if(!el) return;
    const total = cart.reduce((s,i)=> s + (i.quantity||1), 0);
    el.textContent = total; el.style.display = total>0 ? 'inline' : 'none';
}

function normalizeItem(raw){
    if(!raw) return null;
    const qty = Math.max(1, parseInt(raw.quantity)||1);
    return { id: raw.id, name: raw.name, price: parseFloat(raw.price)||0, quantity: qty, image: raw.image||'' };
}

// Flexible addToCart:
//  * addToCart(id) -> uses catalog
//  * addToCart(id, quantity)
//  * addToCart({id,name,price,quantity,image})
//  * addToCart(id, name, price, quantity, image)
window.addToCart = function(...args){
    let item = null;
    if(typeof args[0] === 'object'){
        item = normalizeItem(args[0]);
    } else {
        const id = args[0];
        if(typeof args[1] === 'number' && args.length === 2){
            const base = PRODUCT_CATALOG[id]; if(!base){ console.warn('Unknown product id', id); return; }
            item = { ...base, quantity: args[1] };
        } else if(typeof args[1] === 'string'){ // id, name, price, qty?, image?
            const name = args[1];
            const price = parseFloat(args[2])||0;
            const qty = Math.max(1, parseInt(args[3])||1);
            const img = args[4] || '';
            item = { id, name, price, quantity: qty, image: img };
        } else { // just id -> catalog
            const base = PRODUCT_CATALOG[id]; if(!base){ console.warn('Unknown product id', id); return; }
            item = { ...base, quantity:1 };
        }
    }
    if(!item || !item.id){ console.warn('Invalid cart item', args); return; }
    const existing = cart.find(x=>x.id===item.id);
    if(existing) existing.quantity += item.quantity; else cart.push(item);
    saveCart(); syncCartCount(); emitCartEvent();
    if(window.showNotification) window.showNotification(`${item.name} wurde zum Warenkorb hinzugefügt!`,'success');
};

window.removeFromCart = function(id){ cart = cart.filter(x=>x.id!==id); saveCart(); syncCartCount(); emitCartEvent(); };
window.clearCart = function(){ cart=[]; saveCart(); syncCartCount(); emitCartEvent(); };
window.getCart = function(){ return [...cart]; };

document.addEventListener('DOMContentLoaded', syncCartCount);
document.addEventListener('cartUpdated', syncCartCount);

// Expose for debugging
window.__CartDebug = { migrateLegacyCarts, PRODUCT_CATALOG };