const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("passport")
// const config = require("./config/config")

/* 
1er argumento objeto con la info
2do argumento es la llave privada
3er argumento tiempo de expiracion
*/
const generateToken = (user) => {
  const token = jwt.sign({user}, process.env.PRIVATE_KEY , {expiresIn: "1h"})
  return token
}

const authToken = (req, res, next) =>{
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({
      error: "Not authenticated - No hay headers porque no hay token"
    })
  }
  const token = authHeader.split(" ")[1]
  jwt.verify(token, process.env.PRIVATE_KEY, (error, credentials) =>{
    if(error){
      return res.status(403).send({
        error: "Not authorized - Token inválido"
      })
    }
    req.user = credentials.user
    next();
  })
}

const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send({ error: info.message || info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}

const authorization = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user.user;

    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    // Verifica si el rol del usuario está en el array de roles permitidos
    if (!allowedRoles.includes(user.rol)) {
      return res.status(403).send({ error: "No tienes permisos para acceder" });
    }

    next();
  };
}

const isAdmin = (req, res, next) => {
  const user = req.user.user;

  if (!user || user.rol !== "admin") {
    return res.status(403).send({ error: "No tienes permisos de administrador" });
  }

  next();
};

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

module.exports = {
  createHash,
  isValidPassword,
  generateToken,
  authToken,
  passportCall,
  authorization,
  isAdmin
}