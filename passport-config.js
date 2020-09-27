const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByName, getUserById) {

  const authenticateUser = async(name, password, done) => {
    let user = await getUserByName(name)
    //console.log(name)
    console.log(user)
    if (!user) {
      return done(null, false, { message: "No user with that name." });
    }
    
    try{
      if(await bcrypt.compare(password, user.password)){
        return done(null, user)
      }else{
        return done(null, false, {message: 'Password incorrect.'});
      }
    }catch(e){
      return done(e)
    }

  };
  passport.use(new LocalStrategy({ usernameField: "name" }, authenticateUser))
   passport.serializeUser((user, done) => done(null, user._id))
   passport.deserializeUser((id, done)=>{
      done(null, getUserById(id))    
    })
    
}

module.exports = initialize