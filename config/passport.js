const GoogleStrategy = require("passport-google-oauth20").Strategy;

const TwitterStrategy = require("passport-twitter").Strategy;

const mongoose = require("mongoose");

const User = require("../models/Users");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_API_SECRET_KEY,
        callbackURL: "/auth/twitter/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
      const newUser = {
        twitterId: profile._json.id,
        displayName: profile._json.name,
        firstName: profile._json.name,
        image: profile._json.profile_image_url.replace('_normal',''),
      }

      try {
        let user = await User.findOne({ twitterId: profile.id });
        if (user) {
          return cb(null, user);
        } else {
          user = await new User(newUser).save();
         return cb(null, user);
        }
      } catch (error) {
        console.error(error);
        }

        // return cb(null, newUser)
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
