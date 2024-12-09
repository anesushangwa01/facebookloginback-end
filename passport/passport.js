const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/User'); 

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create a user in the database
    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      user = new User({
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null
      });
      await user.save();
    }
    // Pass the user to the session
    return done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user to retrieve user data from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
