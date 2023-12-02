const express = require("express")
const app = express()
const handlebars = require("express-handlebars");
const path = require("path");

// Importando funcion de conexion de la db
const connectDB = require("./config/db.js")

// Cargar variables de entorno
require('dotenv').config();

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

// Importando Rutas
const userRoutes = require('./routes/user.router.js');
// const authRoutes = require('./routes/auth.router.js')
const productRoutes = require("./routes/product.router.js")
const cartRouter = require("./routes/cart.router.js")
const vistasRouter = require("./routes/vistas.Router.js")


const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializaPassport()
app.use(passport.initialize())

app.use("/users", userRoutes)
app.use("/products", productRoutes)
app.use("/cart", cartRouter)
app.use("/", vistasRouter)


app.listen(PORT, ()=>{
  console.log(`Servidor corriendo en el puerto ${PORT}`);
})