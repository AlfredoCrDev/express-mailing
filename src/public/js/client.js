document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if(loginForm){
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Solicitud de inicio de sesión
    const response = await fetch("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.token) {
        // Almacena el token en el LocalStorage
        localStorage.setItem('token', data.token);

        // Obtener datos del usuario para determinar la redirección
        const userResponse = await fetch("/users/userinfo", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        }); 

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.payload.rol === "admin") {
            // Redirige al perfil de administrador
            window.location.assign("/profile");
          } else if (userData.payload.rol === "usuario") {
            // Redirige a la página de productos para usuarios
            window.location.assign("/products");
          }
        } else {
          console.log("Error al obtener datos del usuario");
        }
      } else {
        console.log("Error en el inicio de sesión");
      }
    } else {
      console.log("Error en el inicio de sesión");
    }
  })};
});

const emailForm = document.getElementById("emailForm");
if(emailForm){
  emailForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const nombre = document.getElementById("nombre").value
    const destinatario = document.getElementById("destinatario").value
    const asunto = document.getElementById("asunto").value
    const mensaje = document.getElementById("mensaje").value
  
    const response = await fetch("/correo", {
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({nombre, destinatario, asunto, mensaje})
    })
    if(!response.ok) throw new Error("No se ha podido enviar el correo.")
    alert("Correo enviado correctamente.");
    emailForm.reset()
    window.history.replaceState({}, document.title, window.location.pathname);

  })
}

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", async (e) => {
    try {
      const response = await fetch("/users/logout", {
        method: "GET", 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }

      // Tampoco funciona haciendolo del lado del cliente
      localStorage.removeItem("token");

      window.location.href = "/";
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}

const formRegister = document.getElementById("formRegister");
if(formRegister){
  formRegister.addEventListener("submit",async function(e){
    e.preventDefault();
    const first_name = document.getElementById("first_name").value
    const last_name = document.getElementById("last_name").value
    const email = document.getElementById("email").value
    const age = document.getElementById("age").value
    const password = document.getElementById("password").value
    const rol = document.getElementById("rol").value

    const response = await fetch ("/users/register", {
      method:"POST",
      body: JSON.stringify({ first_name, last_name, email, age, password, rol }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      const data = await response.json();
      if (data.redirect) {
        alert("Usuario Creado Con Exito, sera redirigido al inicio!");
        window.location.assign(data.redirect);
      } else {
        console.log("Respuesta exitosa:", data);
      }
    } else {
      console.log("Error en la solicitud:", response.status, response.statusText);
      const errorMessage = await response.text();
      console.log("Mensaje de error:", errorMessage);
      alert("Error en la solicitud: " + errorMessage);
    }
  })
}

// Función para agregar un producto a la tabla
function agregarProductoALaTabla(producto) {
  const tablaProductos = document.querySelector("table tbody");

  // Crear una nueva fila de tabla para el producto
  const nuevaFila = document.createElement("tr");
  nuevaFila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.title}</td>
            <td>${producto.description}</td>
            <td>$ ${producto.price}</td>
            <td>${producto.stock}</td>
            <td>${producto.code}</td>
            <td>${producto.thumbnail}</td>
            <td>${producto.category}</td>
            <td>${producto.status}</td>
        `;

  // Agregar la nueva fila a la tabla
  tablaProductos.appendChild(nuevaFila);
}

// Función para eliminar un producto de la tabla
function eliminarProductoDeLaTabla(productId) {
  const filaAEliminar = document.querySelector(`body > table > tbody > tr[data-id="${productId}"]`);
  if (filaAEliminar) {
    filaAEliminar.remove();
  }
}

// Manejar el evento submit del formulario de eliminar
const formularioEliminar = document.getElementById("formulario-eliminar");
if (formularioEliminar) {
  formularioEliminar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productId = document.getElementById("idProduct").value;

    const response = await fetch(`/products/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ productId })
    });
    if (response.ok) {
      eliminarProductoDeLaTabla(productId);
      alert("Producto eliminado con éxito");
      formularioEliminar.reset();
      window.location.reload();
    } else {
      // Error al eliminar el producto
      const errorMessage = await response.json();
      console.error(errorMessage);
      alert("Error al eliminar el producto");
    }
  });
}


// Manejar el evento submit del formulario de agregar
const formularioAgregar = document.getElementById("formulario-agregar");
if(formularioAgregar){
  formularioAgregar.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Obtener los valores ingresados por el usuario
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const code = document.getElementById("code").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value;
    // Validar que los campos no estén vacíos
    if (!title || !description || isNaN(price) || isNaN(stock) || !code) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    // Crear un objeto que representa el nuevo producto
    const nuevoProducto = {
      title,
      description,
      price,
      stock,
      code,
      category,
      status,
    };

    const response = await fetch(`/products/addproduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( nuevoProducto )
    });
    const data = await response.json()
    if (response.ok) {
      agregarProductoALaTabla(data.product)
      alert("Producto agregado con éxito");
      formularioAgregar.reset();
      window.location.reload();
    } else {
      // Error al eliminar el producto
      console.error("Error al agregar el producto");
      alert("Error al agregar el producto");
    }
    // Limpiar los campos del formulario después de agregar el producto
    formularioAgregar.reset();
  
  });

}

const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
  if(addToCartButtons){
    const cartId = document.body.getAttribute('data-cart');

    addToCartButtons.forEach(function(button) {
      button.addEventListener('click', async function(event) {
        event.preventDefault();

        const productId = this.getAttribute('data-product-id');
        try {
            // Realizar la petición POST usando Fetch
        const response = await fetch(`/cart/${cartId}/product/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({}),
        })
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          // Verifica el mensaje en la respuesta
          if (data.success) {
            alert("Producto agregado al carrito");
          } 
        } else {
          console.error("Error al agregar el producto");
          alert(`Error: ${data.error}`);
        }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
          alert("Error al realizar la solicitud");
        }
      
      })
    });
  }

const cartTotalElement = document.getElementById('cartTotal')
  if(cartTotalElement){
    function calculateProductTotals() {
      const productTotalElements = document.querySelectorAll('.product-total');
      const productTotals = [];

      productTotalElements.forEach(element => {
        const quantity = element.getAttribute('data-quantity');
        const price = element.getAttribute('data-price');
        const total = quantity * price;
        productTotals.push(total);
        element.innerText = `${total}`
      });

      return productTotals;
    }

    // Función para calcular el total del carrito
    function calculateCartTotal() {
      const productTotals = calculateProductTotals();
      const cartTotal = productTotals.reduce((sum, total) => sum + total, 0);
      return cartTotal;
    }

    cartTotalElement.innerText = calculateCartTotal();

  }

  const buttonBuy = document.getElementById('button-buy');
  if (buttonBuy) {
  buttonBuy.addEventListener('click', async function(event) {
    event.preventDefault();

    const cartId = this.getAttribute('data-cart-id');
    try {
      // Realizar la petición POST usando Fetch
      const response = await fetch(`/cart/${cartId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({}),
      });
      console.log("Responseeee", response);
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        console.error("Error al realizar la compra");
        alert("Error al realizar la compra");
        return;
      }

      try {
        // Intentar analizar la respuesta como JSON
        const data = await response.json();
        console.log(data);
        // Verificar el éxito en la respuesta JSON
        if (data.status === 'success') {
          alert(`Felicidades: ${data.message} - 
          Usuario: ${data.ticket.purchaser} - 
          Código de compra: ${data.ticket.code} - 
          Por un total de: ${data.ticket.amount}`);
          window.location.href = '/products';
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error al analizar la respuesta JSON:", error);
        alert("Error al analizar la respuesta JSON");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert("Error al realizar la solicitud");
    }
  });
}

  // FUNCION PARA IR A CARRITO CON BOTON 
  // const goToCartButtons = document.querySelectorAll('.go-to-cart-button');
  // if(goToCartButtons){
  //   const cartId = document.body.getAttribute('data-cart');

  //   goToCartButtons.forEach(function(button) {
  //     button.addEventListener('click', async function(event) {
  //       event.preventDefault();

  //       // Realizar la petición POST usando Fetch
  //       const response = await fetch(`/cart/${cartId}/`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         // body: JSON.stringify({}),
  //       })
  //       if (response.ok) {
  //         window.location.assign(`/carrito/${cartId}`);;
  //       } else {
  //         console.error("Error al mostrar el carrito");
  //         alert("Error al mostrar el carrito");
  //       }
  //     })
  //   });
  // }


// Chat 
// const formularioMensaje = document.getElementById("formulario-mensaje");
// formularioMensaje.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const usuario = document.getElementById("usuario").value;
//   const mensaje = document.getElementById("mensaje").value;

//   const newMessage = {
//     user: usuario,
//     message: mensaje,
//   };
// });