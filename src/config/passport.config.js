const passport = require("passport")
const local = require("passport-local")
const utils = require("../utils")
const UserManager = require("../Dao/userManager")
const CartManager = require("../Dao/cartManagerMDB")
const git = require("passport-github2")
const jwt = require("passport-jwt")
const config = require("./config.js")


const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const cookieExtractor = req =>{
  let token = null
  if(req && req.cookies){
    token = req.cookies["token"]
  }
  return token
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : config.secretOrKey,
}

const userManager = new UserManager();
const cartManager = new CartManager()

const LocalStrategy = local.Strategy;
const GitHubStrategy = git.Strategy;
const initializaPassport = () => {
  passport.use("register", new LocalStrategy(
    {passReqToCallback: true, usernameField:"email"}, async (req, username, password, done) => {
      const {first_name, last_name, email, age, rol} = req.body;
      try {
        const findUser = await userManager.findEmailUser({email: username})
        if(findUser){
          console.log("Usuario ya existe");
          return done(null, false, { message: "Usuario ya existe" });
        }
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: utils.createHash(password),
          cart: cartManager.addNewCart(),
          rol
        }
        const user = await userManager.createUser(newUser)
        return done(null, user, { message: "Usuario creado con éxito. Ya puedes iniciar Sesión" })
      } catch (error) {
        return done(error)
      }
    }))

    passport.serializeUser((user, done) => {
      done(null, user.id)
    })
    passport.deserializeUser( async(id, done) => {
      let user = await userManager.getUserById(id);
      done(null, user);
    })

    passport.use("login", new LocalStrategy({
      usernameField: "email"
    }, async (username, password, done) => {
      try {
        const user = await userManager.findEmailUser({ email: username });
        if (!user) {
          return done(null, false, { message: 'Usuario no existe' });
        }
    
        if (!utils.isValidPassword(user, password)) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
    
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }));

    passport.use("github", new GitHubStrategy({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        let user = await userManager.findEmailUser({email:profile._json.email})
        if(!user){
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: 18,
            password: "",
            rol: "admin"
        }
        let result = await userManager.createUser(newUser)
        done(null, result)
      } else {
        done(null, user);
      }
      } catch (error) {
        return done(error)
      }
    }))

    // JWT
  passport.use('jwt', new JwtStrategy({
      jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: config.secretOrKey
  }, async(jwt_payload, done)=>{
      try{
          return done(null, jwt_payload)
      }
      catch(err){
          return done(err)
      }
  }
  ))

}

module.exports = initializaPassport