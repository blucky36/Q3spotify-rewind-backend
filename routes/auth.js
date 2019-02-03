var express = require('express');
var router = express.Router();
const passport = require('passport')
const scope = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-collaborative']
const knex = require('../knex')


require('dotenv').config()
const appUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_URL : 'http://localhost:3000'


router
  .get('/spotify', passport.authenticate('spotify', { scope, showDialog: true }))

  .get('/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/', session: false }), (req, res) => {
      const accessToken = req.user.accessToken
      const refreshToken = req.user.refreshToken

      const spotify_id = req.user.profile.id
      const name = req.user.profile.displayName
      const avatar = req.user.profile.photos[0]

      knex('users').where({ spotify_id }).then(rows => {
        if (rows.length === 0) {
          knex('users').insert({ name, spotify_id, avatar }).then(data => console.log(`new user created: ${spotify_id}`))
        }
      }).then(() => {
        res.redirect(`${appUrl}/handlelogin?accessToken=${accessToken}&userId=${spotify_id}`)
      })
    })

module.exports = router;
