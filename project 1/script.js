// Firebase initialization
firebase.initializeApp({
    apiKey: "AIzaSyCQ_sxU584_5wQAvOGAf7Y0J897Uzzlra0",
    authDomain: "cateringsystem-314b2.firebaseapp.com",
    projectId: "cateringsystem-314b2",
    storageBucket: "cateringsystem-314b2.appspot.com",
    messagingSenderId: "114099234724",
    appId: "1:114099234724:web:0816d06702b84015bb8331",
    measurementId: "G-S3YME3WK86"
});

const auth = firebase.auth();
const db = firebase.firestore();

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const itemSelect = document.getElementById("item-name");
const toast = document.getElementById("toast");

let cart = [];
const products = [
  { name: "Veg Biryani", price: 120 },
  { name: "Chicken Biryani", price: 180 },
  { name: "Paneer Butter Masala", price: 150 },
  { name: "Naan", price: 20 },
  { name: "Gulab Jamun", price: 40 },
  { name: "Masala Dosa", price: 60 },
  { name: "Plain Dosa", price: 50 },
  { name: "Rava Dosa", price: 65 },
  { name: "Onion Uttapam", price: 70 },
  { name: "Idli Sambar", price: 40 },
  { name: "Medu Vada", price: 35 },
  { name: "Pongal", price: 50 },
  { name: "Upma", price: 45 },
  { name: "Lemon Rice", price: 50 },
  { name: "Curd Rice", price: 40 },
  { name: "Sambar Rice", price: 55 },
  { name: "Tomato Rasam", price: 30 },
  { name: "Vegetable Stew", price: 60 },
  { name: "Appam with Stew", price: 75 },
  { name: "Idiyappam", price: 50 },
  { name: "Chicken Chettinad", price: 160 },
  { name: "Mutton Sukka", price: 190 },
  { name: "Fish Curry", price: 140 },
  { name: "Kothu Parotta", price: 90 },
  { name: "Parotta with Salna", price: 60 },
  { name: "Egg Dosa", price: 70 },
  { name: "Neer Dosa", price: 55 },
  { name: "Set Dosa", price: 45 },
  { name: "Thayir Vadai", price: 45 },
  { name: "Kuzhi Paniyaram", price: 50 },
  { name: "Vegetable Kurma", price: 65 },
  { name: "Beetroot Poriyal", price: 40 },
  { name: "Avial", price: 60 },
  { name: "Cabbage Thoran", price: 40 },
  { name: "Drumstick Sambar", price: 50 },
  { name: "Tamarind Rice", price: 45 },
  { name: "Banana Chips", price: 30 },
  { name: "Murukku", price: 25 },
  { name: "Sundal", price: 35 },
  { name: "Filter Coffee", price: 25 },
  { name: "Elaneer Payasam", price: 60 }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function renderProducts() {
  productList.innerHTML = "";
  itemSelect.innerHTML = "";

  products.forEach(product => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - ₹${product.price}`;
    productList.appendChild(li);

    const option = document.createElement("option");
    option.value = product.name;
    option.textContent = product.name;
    itemSelect.appendChild(option);
  });
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => showToast("Registered Successfully"))
    .catch(error => showToast(error.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => showToast("Logged In"))
    .catch(error => showToast(error.message));
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("profile-section").style.display = "none";
    document.getElementById("view-products").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    showToast("Logged Out");
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("profile-section").style.display = "block";
    document.getElementById("view-products").style.display = "block";
    document.getElementById("cart-section").style.display = "block";
    renderProducts();
  }
});

function addToCart() {
  const itemName = itemSelect.value;
  const itemQty = parseInt(document.getElementById("item-qty").value);
  const product = products.find(p => p.name === itemName);

  if (!itemQty || itemQty <= 0) {
    showToast("Please enter a valid quantity");
    return;
  }

  const existing = cart.find(item => item.name === itemName);
  if (existing) {
    existing.qty += itemQty;
  } else {
    cart.push({ name: itemName, qty: itemQty, price: product.price });
  }

  showToast("Item added to cart");
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.qty} = ₹${item.qty * item.price}
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartList.appendChild(li);
    total += item.qty * item.price;
  });

  document.getElementById("total-amount").textContent = total > 0 ? `Total: ₹${total}` : "";
}

function toggleCartList() {
  cartList.style.display = cartList.style.display === "none" ? "block" : "none";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  showToast("Item removed from cart");
}

function placeOrder() {
    const name = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("customer-address").value.trim();
  
    if (!name || !address || cart.length === 0) {
      showToast("Fill all details and add at least one item");
      return;
    }
  
    const order = {
      customer: name,
      address: address,
      items: cart,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  
    db.collection("orders")
      .add(order)
      .then(() => {
        showToast("✅ Order placed successfully!");
        cart = [];
        renderCart();
        document.getElementById("customer-name").value = "";
        document.getElementById("customer-address").value = "";
      })
      .catch(err => {
        console.error(err);
        showToast("❌ Error placing order");
      });
      function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      }
      
  }

