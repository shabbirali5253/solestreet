
const products = [
  {
    id: 1,
    name: "Street Runner",
    brand: "Nike",
    description: "Everyday comfort meets street style.",
    price: 8999,
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "Air Classic",
    brand: "Nike",
    description: "A timeless look for every outfit.",
    price: 12499,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "Cloud Runner",
    brand: "Adidas",
    description: "Lightweight style for daily wear.",
    price: 9999,
    tag: "New",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "Urban Low",
    brand: "Puma",
    description: "Minimal design for everyday wear.",
    price: 7499,
    tag: "Essential",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Retro Street",
    brand: "New Balance",
    description: "Classic vibes with a modern feel.",
    price: 10999,
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Sport Flex",
    brand: "Adidas",
    description: "Made for movement and everyday life.",
    price: 8499,
    tag: "Sport",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "White Essential",
    brand: "Puma",
    description: "Clean sneakers that go with everything.",
    price: 6999,
    tag: "Essential",
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Night Runner",
    brand: "New Balance",
    description: "A bold look for your daily rotation.",
    price: 9499,
    tag: "Featured",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85"
  }
];

const productGrid = document.getElementById("product-grid");
const wishlistGrid = document.getElementById("wishlist-grid");
const wishlistEmpty = document.getElementById("wishlist-empty");
const searchInput = document.getElementById("search-input");
const brandFilter = document.getElementById("brand-filter");
const sortFilter = document.getElementById("sort-filter");

const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartHeadingCount = document.getElementById("cart-heading-count");
const cartTotal = document.getElementById("cart-total");

const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutForm = document.getElementById("checkout-form");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutMessage = document.getElementById("checkout-message");

const shoeSizes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"];

let cart = [];
let wishlist = loadWishlist();

function loadWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem("solestreet-wishlist") || "[]");
    return Array.isArray(saved)
      ? saved.filter(id => products.some(product => product.id === id))
      : [];
  } catch {
    return [];
  }
}

function saveWishlist() {
  try {
    localStorage.setItem("solestreet-wishlist", JSON.stringify(wishlist));
  } catch {
    // Wishlist still works until the page is closed.
  }
}

function money(amount) {
  return "Rs. " + amount.toLocaleString("en-PK");
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}

function isFavorite(id) {
  return wishlist.includes(Number(id));
}

function productCard(product, index = 0, showRemove = false) {
  const favorite = isFavorite(product.id);

  return `
    <article class="product-card" style="animation-delay:${index * 50}ms">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x500/f3f3f0/111111?text=SoleStreet'">
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>

        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button
            class="favorite-button ${favorite ? "active" : ""}"
            data-favorite="${product.id}"
            aria-label="${favorite ? "Remove from" : "Add to"} wishlist"
            aria-pressed="${favorite}">
            ${favorite ? "♥" : "♡"}
          </button>
        </div>

        <label class="size-label" for="size-${product.id}">
          SELECT SIZE
        </label>
        <select class="size-select" id="size-${product.id}"
          aria-label="Select size for ${product.name}">
          <option value="">Choose UK size</option>
          ${shoeSizes.map(size => `<option value="${size}">${size}</option>`).join("")}
        </select>

        <div class="product-actions">
          <button class="add-button" data-add="${product.id}">
            + ADD TO BAG
          </button>
          ${showRemove ? `<button class="remove-button" data-wishlist-remove="${product.id}" aria-label="Remove from wishlist">✕</button>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const brand = brandFilter.value;
  const sort = sortFilter.value;

  let filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    const matchesBrand = brand === "all" || product.brand === brand;

    return matchesSearch && matchesBrand;
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  document.getElementById("results-message").textContent =
    `${filtered.length} sneaker${filtered.length === 1 ? "" : "s"} found`;

  productGrid.innerHTML = filtered.length
    ? filtered.map((product, index) => productCard(product, index)).join("")
    : `<p class="empty-cart">No sneakers found. Try another search or brand.</p>`;
}

function renderWishlist() {
  const favorites = wishlist.map(getProduct).filter(Boolean);

  document.getElementById("wishlist-count").textContent = favorites.length;
  wishlistEmpty.style.display = favorites.length ? "none" : "block";

  wishlistGrid.innerHTML = favorites
    .map((product, index) => productCard(product, index, true))
    .join("");
}

function toggleWishlist(id) {
  id = Number(id);

  if (isFavorite(id)) {
    wishlist = wishlist.filter(savedId => savedId !== id);
  } else {
    wishlist.push(id);
  }

  saveWishlist();
  renderProducts();
  renderWishlist();
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

function addToCart(id, size) {
  if (!size) {
    alert("Please select a UK shoe size first.");
    return;
  }

  const existing = cart.find(
    item => item.id === id && item.size === size
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, size, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, size, amount) {
  const item = cart.find(
    item => item.id === id && item.size === size
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(
      item => !(item.id === id && item.size === size)
    );
  }

  renderCart();
}

function removeFromCart(id, size) {
  cart = cart.filter(
    item => !(item.id === id && item.size === size)
  );
  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartCount.textContent = totalQuantity;
  cartHeadingCount.textContent = `(${totalQuantity})`;
  cartTotal.textContent = money(totalPrice);
  checkoutTotal.textContent = money(totalPrice);

  if (!cart.length) {
    cartItems.innerHTML = `
      <p class="empty-cart">Your bag is empty. Find your next pair!</p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = getProduct(item.id);

    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}"
          onerror="this.onerror=null;this.src='https://placehold.co/150x150/f3f3f0/111111?text=Shoe'">
        <div>
          <h3>${product.name}</h3>
          <p>${item.size} · ${money(product.price)}</p>
          <div class="quantity-controls">
            <button data-minus="${item.id}" data-size="${item.size}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-plus="${item.id}" data-size="${item.size}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-button"
          data-remove="${item.id}" data-size="${item.size}"
          aria-label="Remove ${product.name}">✕</button>
      </div>
    `;
  }).join("");
}

function openCheckout() {
  if (!cart.length) {
    alert("Your bag is empty! Add sneakers first.");
    return;
  }

  closeCart();
  checkoutMessage.textContent = "";
  checkoutOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  checkoutOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

productGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const addButton = event.target.closest("[data-add]");

  if (favoriteButton) {
    toggleWishlist(Number(favoriteButton.dataset.favorite));
  }

  if (addButton) {
    const id = Number(addButton.dataset.add);
    const sizeSelect = document.getElementById(`size-${id}`);
    addToCart(id, sizeSelect.value);
  }
});

wishlistGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const removeButton = event.target.closest("[data-wishlist-remove]");
  const addButton = event.target.closest("[data-add]");

  if (favoriteButton) {
    toggleWishlist(Number(favoriteButton.dataset.favorite));
  }

  if (removeButton) {
    toggleWishlist(Number(removeButton.dataset.wishlistRemove));
  }

  if (addButton) {
    const id = Number(addButton.dataset.add);
    const sizeSelect = document.getElementById(`size-${id}`);
    addToCart(id, sizeSelect.value);
  }
});

cartItems.addEventListener("click", event => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");

  if (minus) {
    changeQuantity(Number(minus.dataset.minus), minus.dataset.size, -1);
  }

  if (plus) {
    changeQuantity(Number(plus.dataset.plus), plus.dataset.size, 1);
  }

  if (remove) {
    removeFromCart(Number(remove.dataset.remove), remove.dataset.size);
  }
});

searchInput.addEventListener("input", renderProducts);
brandFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

document.getElementById("cart-toggle")
  .addEventListener("click", openCart);

document.getElementById("cart-close")
  .addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

document.getElementById("wishlist-toggle")
  .addEventListener("click", () => {
    document.getElementById("wishlist").scrollIntoView({
      behavior: "smooth"
    });
  });

document.getElementById("checkout-button")
  .addEventListener("click", openCheckout);

document.getElementById("checkout-close")
  .addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", event => {
  if (event.target === checkoutOverlay) closeCheckout();
});

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!cart.length) {
    checkoutMessage.textContent = "Your bag is empty.";
    return;
  }

  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const total = cart.reduce((sum, item) => {
    return sum + getProduct(item.id).price * item.quantity;
  }, 0);

  checkoutMessage.textContent =
    `Demo order #${orderNumber} created! Total: ${money(total)}. ` +
    "This is only a local demonstration. No order was sent and no payment was taken.";

  cart = [];
  renderCart();
  checkoutForm.reset();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
  }
});

renderProducts();
renderWishlist();
renderCart();
