// ===============================
// SELEÇÃO DE ELEMENTOS
// ===============================
const addBtns = document.querySelectorAll('.add-btn');
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

// Carrinho com quantidade
let cart = [];

// ==========================================
// FUNÇÃO PARA ATUALIZAR O BOTÃO FIXO
// ==========================================
function updateViewCartButton() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;

  if (totalItems > 0) {
    viewCartBtn.style.display = 'block';
  } else {
    viewCartBtn.style.display = 'none';
  }
}

// ===============================
// FUNÇÃO PARA ATUALIZAR O CARRINHO
// ===============================
function updateCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    emptyCartEl.style.display = 'block';
  } else {
    emptyCartEl.style.display = 'none';

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add('cart-item');

      const info = document.createElement('span');
      info.textContent = `${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`;

      const controls = document.createElement('div');
      controls.style.display = 'flex';
      controls.style.alignItems = 'center';
      controls.style.gap = '5px';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.textContent = '➖';
      minusBtn.classList.add('quantity-btn');
      minusBtn.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        updateCart();
      });

      const quantity = document.createElement('span');
      quantity.textContent = item.quantity;
      quantity.style.minWidth = '20px';
      quantity.style.textAlign = 'center';

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.textContent = '➕';
      plusBtn.classList.add('quantity-btn');
      plusBtn.addEventListener('click', () => {
        item.quantity++;
        updateCart();
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '❌';
      removeBtn.classList.add('remove-btn');
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        updateCart();
      });

      controls.appendChild(minusBtn);
      controls.appendChild(quantity);
      controls.appendChild(plusBtn);
      controls.appendChild(removeBtn);

      li.appendChild(info);
      li.appendChild(controls);
      cartItemsEl.appendChild(li);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalEl.textContent = total.toFixed(2);
  updateViewCartButton();
}

// ===============================
// ADICIONAR ITEM AO CARRINHO
// ===============================
addBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.menu-item');
    const name = itemEl.querySelector('h3').textContent;
    const priceText = itemEl.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());

    const existingItem = cart.find((i) => i.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
  });
});

// ===============================
// LIMPAR CARRINHO
// ===============================
clearCartBtn.addEventListener('click', () => {
  cart = [];
  updateCart();
  customerName.value = '';
  customerAddress.value = '';
  paymentMethod.value = '';
  orderNote.value = '';
});

// ===============================
// ENVIAR PEDIDO PELO WHATSAPP
// ===============================
sendOrderBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('O carrinho está vazio!');
    return;
  }

  if (
    customerName.value.trim() === '' ||
    customerAddress.value.trim() === '' ||
    paymentMethod.value === ''
  ) {
    alert('Por favor, preencha nome, endereço e forma de pagamento.');
    return;
  }

  let message = `🍗 *Pedido Casa dos Salgados*\n\n*Itens:*\n`;
  cart.forEach((item) => {
    message += `- ${item.name} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
  });
  message += `\n*Total: R$ ${cartTotalEl.textContent}*\n`;
  message += `\n*Nome:* ${customerName.value}\n`;
  message += `*Endereço:* ${customerAddress.value}\n`;
  message += `*Pagamento:* ${paymentMethod.value}\n`;
  
  if (orderNote.value.trim() !== '') {
    message += `*Observações:* ${orderNote.value}\n`;
  }

  // LINK DO SITE PARA FICAR CLICÁVEL NO WHATSAPP
  message += `\n*Pedido feito via:* https://casa-dos-salgados-barra.netlify.app`;

  const whatsappNumber = '5581997215857'; 
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  window.open(url, '_blank');
});

// ===============================
// ROLAGEM DO BOTÃO FIXO
// ===============================
viewCartBtn.addEventListener('click', () => {
  const cartSection = document.getElementById('cart');
  if(cartSection) {
    cartSection.scrollIntoView({ behavior: 'smooth' });
  }
});
