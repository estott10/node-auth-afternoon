require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();

app.use(session({
    secret: "Happy happy joy joy",
    resave: false,
    saveUninitialized: false
}));


app.use( passport.initialize() );
app.use( passport.session() );
app.use( passport.Auth0Strategy({
    domain: process.env.DOMAIN,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: './login',
    scope: "openid email profile"
}) )


passport.serializeUser(function(user, done){
    done({
        clientID: user.id,
        email: user._json.email,
        name: user._json.name
    })
})

passport.deserializeUser(function(obj, done){
    done(null, obj);
})

app.get('/login', passport.authenticate('auth0', {
    sucessRedirect: '/students',
    failureRedirect: '/login',
    connection: 'github'
    }
));

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );