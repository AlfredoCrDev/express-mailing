const express = require("express")
const app = express()

// Importando funcion de conexion de la db
const connectDB = require("./config/db.js")

// Cargar variables de entorno
require('dotenv').config();

// Ejecutando funcion de conexion a la Base de datos
connectDB();

// Rutas
const userRoutes = require('./routes/user.router.js');


const PORT = process.env.PORT

app.use(express.json());

app.use("/users", userRoutes)

app.listen(PORT, ()=>{
  console.log(`Servidor corriendo en el puerto ${PORT}`);
})