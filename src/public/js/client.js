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
      console.log("Data", data);
      console.log(data.redirect);
      if (data.redirect) {
        alert("Usuario Creado Con Exito, sera rediregido al inicio!");
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