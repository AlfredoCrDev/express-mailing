const express = require("express")
const app = express()
const handlebars = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");

// Importando funcion de conexion de la db
const connectDB = require("./config/db.js")

// Cargar variables de entorno
require('dotenv').config();

// Importando Rutas
const userRoutes = require('./routes/user.router.js');
// const authRoutes = require('./routes/auth.router.js')
const productRoutes = require("./routes/product.router.js")
const cartRouter = require("./routes/cart.router.js")
const vistasRouter = require("./routes/vistas.Router.js")
const mailRouter = require("./routes/mail.router.js")

// Passport
const passport = require("passport")
const initializaPassport = require("./config/passport.config")

// Configuracion handlebars
app.engine("handlebars", handlebars.engine());
//Carpeta de la vista
app.set("views", __dirname + "/views");
//Establecer handlebars como motor de plantilla
app.set("view engine", "handlebars");
//Archivos dentro de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ejecutando funcion de conexion a la Base de datos
connectDB();

// Websockect
const http = require("http");
const socketIo = require("socket.io");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

/************  SOCKET.IO *******************/
io.on("connection", (socket) => {
  console.log("Cliente conectado a Socket.io");

  socket.on("agregarProducto", async (nuevoProducto) => {
    const newProducto = await productManager.addProduct(nuevoProducto);

    // Emitiendo un evento para actualizar la lista en el cliente.
    io.emit("productoAgregado", newProducto);
  });

  socket.on("eliminarProducto", async (productoId) => {
    await productManager.deleteProduct(parseInt(productoId));

    // Emitiendo un evento para actualizar la lista en el cliente.
    io.emit("productoEliminado", productoId);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado de Socket.io");
  });
});
/************  FIN SOCKET.IO *******************/


const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Inicializar el middleware de autenticacion
initializaPassport()
app.use(passport.initialize())

app.use("/users", userRoutes)
app.use("/products", productRoutes)
app.use("/cart", cartRouter)
app.use("/", vistasRouter)
app.use("/", mailRouter)


app.listen(PORT, ()=>{
  console.log(`Servidor corriendo en el puerto ${PORT}`);
})