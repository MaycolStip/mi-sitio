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

const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");

let productos = []; // Aquí guardamos todos los productos con id

// Función para mostrar productos
function renderProductos(lista) {
  container.innerHTML = ""; // Limpiar contenedor

  if (lista.length === 0) {
    container.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  lista.forEach(({id, imageURL, title, price}) => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.width = "calc(33% - 20px)";
    card.style.cursor = "pointer";
    card.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)";
    card.style.borderRadius = "8px";
    card.onclick = () => {
      window.location.href = `detalle.html?id=${id}`;
    };

    card.innerHTML = `
      <img src="${imageURL}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
      <h3>${title}</h3>
      <p>$${price}</p>
    `;

    container.appendChild(card);
  });
}

// Cargar productos de Firestore
db.collection("products").get().then((querySnapshot) => {
  productos = []; // reset
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    productos.push({
      id: doc.id,
      imageURL: product.imageURL,
      title: product.title,
      price: product.price,
      description: product.description || ""
    });
  });
  renderProductos(productos);
});

// Evento para buscar en el input
searchInput.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();
  const filtrados = productos.filter(p => 
    p.title.toLowerCase().includes(texto) || p.description.toLowerCase().includes(texto)
  );
  renderProductos(filtrados);
});
