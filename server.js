const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '<your_google_client_id>';
const GOOGLE_CLIENT_SECRET = '<your_google_secret_key>';

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.render('pages/auth');
});
// app.get('/success', function(req, res) {
//     res.render('pages/success');
// });

/*  PASSPORT SETUP  */


var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) =>{
    console.log("success:-",userProfile)
    // res.send(userProfile)
    res.render('pages/success',{
        user: userProfile
    });
} 
);
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
 

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] })
);
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {

    // Successful authentication, redirect success.
    // console.log("success:",res)
    res.redirect('/success');
  });



  
const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));