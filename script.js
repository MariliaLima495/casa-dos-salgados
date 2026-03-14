// ===============================
// CONFIGURAÇÕES E SELEÇÃO
// ===============================
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const emptyCartEl = document.getElementById('empty-cart');
const clearCartBtn = document.getElementById('clear-cart');
const sendOrderBtn = document.getElementById('send-order');
const customerName = document.getElementById('customer-name');
const customerAddress = document.getElementById('customer-address');
const paymentMethod = document.getElementById('payment-method');
const orderNote = document.getElementById('order-note');
const viewCartBtn = document.getElementById('view-cart-btn');
const cartCountEl = document.getElementById('cart-count');

let cart = [];

// ==========================================
// CARREGAR PRODUTOS DO CMS (NOVO)
// ==========================================
async function loadProducts() {
    try {
        // Busca a lista de arquivos na pasta que o CMS cria
        // Nota: No GitHub Pages/Netlify, precisamos de um index ou buscar via API. 
        // Para simplificar, o CMS gera arquivos em data/cardapio.
        
        // Aqui buscamos o arquivo que o CMS gera (index.json ou via fetch da pasta)
        // Como o Decap CMS gera arquivos .md ou .json, vamos buscar a pasta:
        const response = await fetch('https://api.github.com');
        const files = await response.json();

        for (const file of files) {
            const res = await fetch(file.download_url);
            const product = await res.json();
            renderProduct(product);
        }
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function renderProduct(product) {
    // Escolhe a seção correta baseada na categoria
    const categoryId = product.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const section = document.getElementById(categoryId);
    
    if (!section) return;

    const article = document.createElement('article');
    article.classList.add('menu-item');
    article.innerHTML = `
      <div class="item-details">
        <h3>${product.title}</h3>
        <p>${product.description || ''}</p>
        <span class="price">R$ ${parseFloat(product.price).toFixed(2)}</span>
      </div>
      <button type="button" class="add-btn" onclick="addToCart('${product.title}', ${product.price})">+</button>
    `;
    section.appendChild(article);
}

// ===============================
// LÓGICA DO CARRINHO
// ===============================
window.addToCart = function(name, price) {
    const existingItem = cart.find((i) => i.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
};

function updateViewCartButton() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    viewCartBtn.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateCart() {
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
        emptyCartEl.style.display = 'block';
    } else {
        emptyCartEl.style.display = 'none';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <span>${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}</span>
                <div style="display:flex; align-items:center; gap:5px;">
                    <button class="quantity-btn" onclick="changeQty(${index}, -1)">➖</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQty(${index}, 1)">➕</button>
                    <button class="remove-btn" onclick="removeItem(${index})">❌</button>
                </div>
            `;
            cartItemsEl.appendChild(li);
        });
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalEl.textContent = total.toFixed(2);
    updateViewCartButton();
}

window.changeQty = function(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
};

window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCart();
};

// ===============================
// FINALIZAR PEDIDO
// ===============================
sendOrderBtn.addEventListener('click', () => {
    if (cart.length === 0 || !customerName.value || !customerAddress.value || !paymentMethod.value) {
        alert('Preencha todos os campos!');
        return;
    }

    let message = `🍗 *Pedido Casa dos Salgados*\n\n`;
    cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: R$ ${cartTotalEl.textContent}*`;
    message += `\n\n*Cliente:* ${customerName.value}\n*Endereço:* ${customerAddress.value}\n*Pagamento:* ${paymentMethod.value}`;
    message += `\n\n*Site:* https://casa-dos-salgados-barra.netlify.app`;

    window.open(`https://wa.me{encodeURIComponent(message)}`, '_blank');
});

clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCart();
});

viewCartBtn.addEventListener('click', () => {
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
});

// Inicia o carregamento
loadProducts();
