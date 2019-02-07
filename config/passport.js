const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy
require('dotenv').config()

const callbackURL = process.env.NODE_ENV === 'production' ? `${process.env.SERVER_URL}/auth/spotify/callback` : 'http://localhost:3000/auth/callback'

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL
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
