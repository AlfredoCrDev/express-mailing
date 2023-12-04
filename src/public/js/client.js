document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

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

        console.log(userResponse);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.payload.rol === "admin") {
            // Redirige al perfil de administrador
            window.location.assign("/profile");
          } else if (userData.rol === "usuario") {
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
  });
});
