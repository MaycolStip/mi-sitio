const firebaseConfig = {
  apiKey: "AIzaSyDo8WFlnob-Q3f9T9tkZEJpqtB7DG23Wnk",
  authDomain: "mi-tienda-5456b.firebaseapp.com",
  projectId: "mi-tienda-5456b",
  storageBucket: "mi-tienda-5456b.firebasestorage.app",
  messagingSenderId: "76766145687",
  appId: "1:76766145687:web:d4a3fd1f7bbf090df34dd2"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// Referencias al DOM
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');

// Guardar productos en memoria para filtrar
let productosGuardados = [];

async function cargarProductos() {
  try {
    const querySnapshot = await firestore.collection('products').orderBy('createdAt', 'desc').get();

    if (querySnapshot.empty) {
      productsContainer.innerHTML = "<p>No hay productos para mostrar.</p>";
      return;
    }

    productosGuardados = [];
    querySnapshot.forEach(doc => {
      const product = doc.data();
      productosGuardados.push(product);
    });

    mostrarProductos(productosGuardados);

  } catch (error) {
    console.error("Error al obtener productos:", error);
    productsContainer.innerHTML = "<p>Error cargando productos.</p>";
  }
}

function mostrarProductos(productos) {
  if (productos.length === 0) {
    productsContainer.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  productsContainer.innerHTML = "";

  productos.forEach(product => {
    const productCard = document.createElement('div');
    productCard.style.border = "1px solid #ddd";
    productCard.style.borderRadius = "10px";
    productCard.style.padding = "15px";
    productCard.style.width = "250px";
    productCard.style.background = "white";
    productCard.style.boxShadow = "0 3px 8px rgba(0,0,0,0.1)";
    productCard.style.display = "flex";
    productCard.style.flexDirection = "column";
    productCard.style.alignItems = "center";

    const img = document.createElement('img');
    img.src = product.imageURL;
    img.alt = product.title;
    img.style.width = "100%";
    img.style.height = "160px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px 8px 0 0";

    const title = document.createElement('h3');
    title.textContent = product.title;
    title.style.margin = "12px 0 8px 0";
    title.style.color = "#333";

    const desc = document.createElement('p');
    desc.textContent = product.description;
    desc.style.color = "#555";
    desc.style.fontSize = "14px";
    desc.style.flexGrow = "1";

    const price = document.createElement('p');
    price.textContent = `Precio: $${product.price.toFixed(2)}`;
    price.style.fontWeight = "700";
    price.style.marginTop = "12px";
    price.style.color = "#3f51b5";

    productCard.appendChild(img);
    productCard.appendChild(title);
    productCard.appendChild(desc);
    productCard.appendChild(price);

    productsContainer.appendChild(productCard);
  });
}

// Filtrar productos en tiempo real según búsqueda
searchInput.addEventListener('input', (e) => {
  const textoBuscado = e.target.value.toLowerCase().trim();

  const productosFiltrados = productosGuardados.filter(prod =>
    prod.title.toLowerCase().includes(textoBuscado) ||
    prod.description.toLowerCase().includes(textoBuscado)
  );

  mostrarProductos(productosFiltrados);
});

// Cargar productos al iniciar la página
cargarProductos();