const products = [
  {
    id: 1,
    name: "Street Runner",
    description: "Everyday comfort meets street style.",
    price: 8999,
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "Air Classic",
    description: "A timeless look for every outfit.",
    price: 12499,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "Cloud Runner",
    description: "Lightweight style for daily wear.",
    price: 9999,
    tag: "New",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "Urban Low",
    description: "Minimal design. Maximum versatility.",
    price: 7499,
    tag: "Essential",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Retro Street",
    description: "Classic vibes with a modern feel.",
    price: 10999,
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Sport Flex",
    description: "Made for movement and everyday life.",
    price: 8499,
    tag: "Sport",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "White Essential",
    description: "Clean sneakers that go with everything.",
    price: 6999,
    tag: "Essential",
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Night Runner",
    description: "A bold look for your daily rotation.",
    price: 9499,
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85"
  }
];

const productGrid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartHeadingCount = document.getElementById("cart-heading-count");
const cartTotal = document.getElementById("cart-total");

let cart = [];

function money(amount) {
  return "Rs. " + amount.toLocaleString("en-PK");
}

function renderProducts() {
  productGrid.innerHTML = products.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 60}ms">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x500/f3f3f0/111111?text=SoleStreet'"
        >
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + ADD
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();

  const button = document.querySelector(`[data-add="${id}"]`);
  if (button) {
    const originalText = button.textContent;
    button.textContent = "ADDED ✓";
    button.style.background = "#d4ff45";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "";
    }, 900);
  }
}

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartCount.textContent = totalQuantity;
  cartHeadingCount.textContent = `(${totalQuantity})`;
  cartTotal.textContent = money(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Your bag is empty. Find your next pair!
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(
      product => product.id === item.id
    );

    return `
      <div class="cart-item">
        <img
          src="${product.image}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='https://placehold.co/150x150/f3f3f0/111111?text=Shoe'"
        >
        <div>
          <h3>${product.name}</h3>
          <p>${money(product.price)}</p>
          <div class="quantity-controls">
            <button data-minus="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-plus="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button
          class="remove-button"
          data-remove="${product.id}"
          aria-label="Remove ${product.name}"
        >✕</button>
      </div>
    `;
  }).join("");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");

  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

document.getElementById("cart-toggle")
  .addEventListener("click", openCart);

document.getElementById("cart-close")
  .addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

document.getElementById("checkout-button")
  .addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your bag is empty! Add some sneakers first.");
      return;
    }

    alert(
      "Thanks for shopping at SoleStreet! " +
      "This is a demo store, so real checkout and payments " +
      "are not enabled yet."
    );
  });

renderProducts();
renderCart();
