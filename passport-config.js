const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById ){
    const authenticateUser = async (email, password, done) =>{
        try{
            const user = await getUserByEmail(email);
            if( user == null ) {
                return done(null, false, {message: 'No user with that email'} );
            }
            
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect Password'})
            }
        }catch(err){
            return done(err);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'},
    authenticateUser));
    passport.serializeUser((user, done) => {
        return done(null, user.id)
    });
    passport.deserializeUser( async (id, done) => {
        try{
            const user = await getUserById(id);
            return done(null, user);
        }catch(err){
            console.log(err);
        }
     });
}

module.exports = initialize;