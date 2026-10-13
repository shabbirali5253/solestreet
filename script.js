
const products = [
  { id: 1, name: "Street Runner", brand: "Nike", description: "Everyday comfort meets street style.", price: 8999, tag: "Bestseller", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85" },
  { id: 2, name: "Air Classic", brand: "Nike", description: "A timeless look for every outfit.", price: 12499, tag: "Popular", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85" },
  { id: 3, name: "Cloud Runner", brand: "Adidas", description: "Lightweight style for daily wear.", price: 9999, tag: "New", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85" },
  { id: 4, name: "Urban Low", brand: "Puma", description: "Minimal design for everyday wear.", price: 7499, tag: "Essential", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85" },
  { id: 5, name: "Retro Street", brand: "New Balance", description: "Classic vibes with a modern feel.", price: 10999, tag: "Trending", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=85" },
  { id: 6, name: "Sport Flex", brand: "Adidas", description: "Made for movement and everyday life.", price: 8499, tag: "Sport", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85" },
  { id: 7, name: "White Essential", brand: "Puma", description: "Clean sneakers that go with everything.", price: 6999, tag: "Essential", image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85" },
  { id: 8, name: "Night Runner", brand: "New Balance", description: "A bold look for your daily rotation.", price: 9499, tag: "Featured", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85" }
];

const $ = id => document.getElementById(id);

const productGrid = $("product-grid");
const wishlistGrid = $("wishlist-grid");
const wishlistEmpty = $("wishlist-empty");
const searchInput = $("search-input");
const brandFilter = $("brand-filter");
const sortFilter = $("sort-filter");

const cartPanel = $("cart-panel");
const cartOverlay = $("cart-overlay");
const cartItems = $("cart-items");
const cartCount = $("cart-count");
const cartHeadingCount = $("cart-heading-count");
const cartTotal = $("cart-total");

const checkoutOverlay = $("checkout-overlay");
const checkoutForm = $("checkout-form");
const checkoutTotal = $("checkout-total");
const checkoutMessage = $("checkout-message");

const productModal = $("product-modal");
const detailImage = $("detail-image");
const detailBrand = $("detail-brand");
const detailName = $("detail-name");
const detailPrice = $("detail-price");
const detailDescription = $("detail-description");
const detailSizeArea = $("detail-size-area");
const detailAddButton = $("detail-add-button");

const shoeSizes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"];

let cart = [];
let wishlist = loadWishlist();
let selectedDetailProduct = null;
let previousBodyOverflow = "";

function loadWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem("solestreet-wishlist") || "[]");
    return Array.isArray(saved)
      ? saved.filter(id => products.some(product => product.id === Number(id))).map(Number)
      : [];
  } catch {
    return [];
  }
}

function saveWishlist() {
  try {
    localStorage.setItem("solestreet-wishlist", JSON.stringify(wishlist));
  } catch {
    // Wishlist works for this session even if storage is unavailable.
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
      <div class="product-image" data-details="${product.id}" role="button" tabindex="0" aria-label="View ${product.name} details">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x500/f3f3f0/111111?text=SoleStreet'">
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3 class="clickable-product-name" data-details="${product.id}" role="button" tabindex="0">${product.name}</h3>
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

        <label class="size-label" for="size-${product.id}">SELECT SIZE</label>
        <select class="size-select" id="size-${product.id}" aria-label="Select size for ${product.name}">
          <option value="">Choose UK size</option>
          ${shoeSizes.map(size => `<option value="${size}">${size}</option>`).join("")}
        </select>

        <div class="product-actions">
          <button class="add-button" data-add="${product.id}">+ ADD TO BAG</button>
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

    return matchesSearch && (brand === "all" || product.brand === brand);
  });

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  const resultsMessage = $("results-message");
  if (resultsMessage) {
    resultsMessage.textContent = `${filtered.length} sneaker${filtered.length === 1 ? "" : "s"} found`;
  }

  productGrid.innerHTML = filtered.length
    ? filtered.map((product, index) => productCard(product, index)).join("")
    : `<p class="empty-cart">No sneakers found. Try another search or brand.</p>`;
}

function renderWishlist() {
  const favorites = wishlist.map(getProduct).filter(Boolean);

  const wishlistCount = $("wishlist-count");
  if (wishlistCount) wishlistCount.textContent = favorites.length;

  wishlistEmpty.style.display = favorites.length ? "none" : "block";

  wishlistGrid.innerHTML = favorites
    .map((product, index) => productCard(product, index, true))
    .join("");
}

function toggleWishlist(id) {
  id = Number(id);

  wishlist = isFavorite(id)
    ? wishlist.filter(savedId => savedId !== id)
    : [...wishlist, id];

  saveWishlist();
  renderProducts();
  renderWishlist();
}

function openProductDetails(id) {
  const product = getProduct(id);
  if (!product || !productModal) return;

  selectedDetailProduct = product;
  previousBodyOverflow = document.body.style.overflow;

  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailImage.onerror = () => {
    detailImage.onerror = null;
    detailImage.src = "https://placehold.co/600x500/f3f3f0/111111?text=SoleStreet";
  };

  detailBrand.textContent = product.brand;
  detailName.textContent = product.name;
  detailPrice.textContent = money(product.price);
  detailDescription.textContent = product.description;

  detailSizeArea.innerHTML = `
    <label for="detail-size-select">SELECT UK SIZE</label>
    <select id="detail-size-select" aria-label="Choose UK shoe size">
      <option value="">Choose UK size</option>
      ${shoeSizes.map(size => `<option value="${size}">${size}</option>`).join("")}
    </select>
  `;

  productModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductDetails() {
  if (!productModal) return;
  productModal.classList.remove("open");
  selectedDetailProduct = null;

  if (!cartPanel.classList.contains("open") &&
      !checkoutOverlay.classList.contains("open")) {
    document.body.style.overflow = previousBodyOverflow;
  }
}

function handleDetailsClick(event) {
  const detailsTarget = event.target.closest("[data-details]");
  if (detailsTarget) openProductDetails(detailsTarget.dataset.details);
}

function handleDetailsKeydown(event) {
  if ((event.key === "Enter" || event.key === " ") &&
      event.target.matches("[data-details]")) {
    event.preventDefault();
    openProductDetails(event.target.dataset.details);
  }
}

function openCart() {
  previousBodyOverflow = document.body.style.overflow;
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");

  if (!productModal.classList.contains("open") &&
      !checkoutOverlay.classList.contains("open")) {
    document.body.style.overflow = previousBodyOverflow;
  }
}

function addToCart(id, size) {
  id = Number(id);

  if (!size) {
    alert("Please select a UK shoe size first.");
    return;
  }

  const existing = cart.find(item => item.id === id && item.size === size);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, size, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(id, size, amount) {
  const item = cart.find(item => item.id === Number(id) && item.size === size);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => !(item.id === Number(id) && item.size === size));
  }

  renderCart();
}

function removeFromCart(id, size) {
  cart = cart.filter(item => !(item.id === Number(id) && item.size === size));
  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalQuantity;
  cartHeadingCount.textContent = `(${totalQuantity})`;
  cartTotal.textContent = money(totalPrice);
  checkoutTotal.textContent = money(totalPrice);

  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-cart">Your bag is empty. Find your next pair!</p>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return "";

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
        <button class="remove-button" data-remove="${item.id}" data-size="${item.size}" aria-label="Remove ${product.name}">✕</button>
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
  previousBodyOverflow = document.body.style.overflow;
  checkoutOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  checkoutOverlay.classList.remove("open");

  if (!cartPanel.classList.contains("open") &&
      !productModal.classList.contains("open")) {
    document.body.style.overflow = previousBodyOverflow;
  }
}

/* Product grid events */
productGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const addButton = event.target.closest("[data-add]");

  if (favoriteButton) {
    toggleWishlist(favoriteButton.dataset.favorite);
    return;
  }

  if (addButton) {
    const id = Number(addButton.dataset.add);
    const sizeSelect = $("size-" + id);
    addToCart(id, sizeSelect.value);
    return;
  }

  handleDetailsClick(event);
});

productGrid.addEventListener("keydown", handleDetailsKeydown);

/* Wishlist events */
wishlistGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const removeButton = event.target.closest("[data-wishlist-remove]");
  const addButton = event.target.closest("[data-add]");

  if (favoriteButton) {
    toggleWishlist(favoriteButton.dataset.favorite);
    return;
  }

  if (removeButton) {
    toggleWishlist(removeButton.dataset.wishlistRemove);
    return;
  }

  if (addButton) {
    const id = Number(addButton.dataset.add);
    addToCart(id, $("size-" + id).value);
    return;
  }

  handleDetailsClick(event);
});

wishlistGrid.addEventListener("keydown", handleDetailsKeydown);

/* Product popup events */
$("product-modal-close").addEventListener("click", closeProductDetails);

productModal.addEventListener("click", event => {
  if (event.target === productModal) closeProductDetails();
});

detailAddButton.addEventListener("click", () => {
  if (!selectedDetailProduct) return;

  const size = $("detail-size-select").value;

  if (!size) {
    alert("Please select a UK shoe size first.");
    return;
  }

  addToCart(selectedDetailProduct.id, size);
  closeProductDetails();
  openCart();
});

/* Cart events */
cartItems.addEventListener("click", event => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");

  if (minus) changeQuantity(minus.dataset.minus, minus.dataset.size, -1);
  if (plus) changeQuantity(plus.dataset.plus, plus.dataset.size, 1);
  if (remove) removeFromCart(remove.dataset.remove, remove.dataset.size);
});

/* Search, filters and sorting */
searchInput.addEventListener("input", renderProducts);
brandFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

/* Header and overlays */
$("cart-toggle").addEventListener("click", openCart);
$("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

$("wishlist-toggle").addEventListener("click", () => {
  $("wishlist").scrollIntoView({ behavior: "smooth" });
});

$("checkout-button").addEventListener("click", openCheckout);
$("checkout-close").addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", event => {
  if (event.target === checkoutOverlay) closeCheckout();
});

/* Demo checkout only — no real order or payment */
checkoutForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!cart.length) {
    checkoutMessage.textContent = "Your bag is empty.";
    return;
  }

  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  checkoutMessage.textContent =
    `Demo order #${orderNumber} created! Total: ${money(total)}. ` +
    "This is only a local demonstration. No order was sent and no payment was taken.";

  cart = [];
  renderCart();
  checkoutForm.reset();
});

/* Close popups with Escape */
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProductDetails();
    closeCart();
    closeCheckout();
  }
});

/* Start the store */
renderProducts();
renderWishlist();
renderCart();
