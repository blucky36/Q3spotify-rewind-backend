const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy
require('dotenv').config()

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://spotify-rewind-backend.herokuapp.com/auth/spotify/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const user = {
      profile,
      accessToken,
      refreshToken,
    }
    done(null, user)
  }

))
