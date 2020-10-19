const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});
passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
  });
})

passport.use('signin',
      new localStrategy(
        async(username, password, done)=>{
          User.findOne({username},async (err, user)=>{
            try{
                if(err){ return done(err);}
                if(!user){
                    return done(null, false, {message:'User not found'});
                }
                if(!(await user.validatePassword(password).catch((e) => { console.error(e.message) }))){
                    return done(null, false, {message:'Wrong Password'});
                }
                return done(null, user);
            }
            catch(error){
                return done(error);
            }
        })
        }
      )
)


