
const firebaseConfig = {
  apiKey: "AIzaSyDo8WFlnob-Q3f9T9tkZEJpqtB7DG23Wnk",
  authDomain: "mi-tienda-5456b.firebaseapp.com",
  projectId: "mi-tienda-5456b",
  storageBucket: "mi-tienda-5456b.firebasestorage.app",
  messagingSenderId: "76766145687",
  appId: "1:76766145687:web:d4a3fd1f7bbf090df34dd2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const detalle = document.getElementById("detalle");
let productoActual = null; // variable global para guardar los datos del producto

// Cargar datos del producto
db.collection("products").doc(id).get().then((doc) => {
  if (doc.exists) {
    const data = doc.data();
    productoActual = data;

    detalle.innerHTML = `
      <img src="${data.imageURL}" alt="${data.title}" style="width:100%; max-height:400px; object-fit:cover; border-radius: 8px;">
      <h1>${data.title}</h1>
      <p>${data.description}</p>
      <h2 style="color: green;">$${data.price}</h2>
      <button onclick="pedir()" style="margin-top: 20px; padding: 10px 20px;">Pedir</button>
      <br><br>
      <button onclick="agregarCarrito()" style="padding: 10px 20px;">Añadir al carrito</button>
    `;
  } else {
    detalle.innerHTML = "<p>Producto no encontrado.</p>";
  }
});

function pedir() {
  const telefono = prompt("Por favor ingresa tu número de teléfono:");

  if (!telefono || telefono.trim().length < 7) {
    alert("Número no válido");
    return;
  }

  const pedido = {
    title: productoActual.title,
    price: productoActual.price,
    phone: telefono,
    date: firebase.firestore.Timestamp.fromDate(new Date())
  };

  db.collection("orders").add(pedido)
    .then(() => {
      localStorage.setItem('ultimoPedidoExitoso', 'true');
      window.location.href = 'productos.html'; // Redirige al listado de productos
    })
    .catch(error => {
      alert("Error al guardar el pedido: " + error.message);
    });
}

function agregarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto añadido al carrito.");
}