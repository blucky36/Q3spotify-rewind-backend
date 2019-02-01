var express = require('express');
var router = express.Router();
const knex = require('../knex')



router.get('/users/:uid',(req,res) => {
  const uid = req.params.uid
  knex('users').where({ spotify_id: uid}).first().then(user => {
    res.send(user)
  })
})
.get('/users/:uid/playlists/', (req,res) =>{
  const uid = req.params.uid
  knex('users').where({spotify_id:uid}).first().then(user => {
    knex('playlists').where({user_id:user.id}).then(playlists => {
      res.send(playlists)
    })
  })
})
.get('/users/:uid/playlists/:pid', (req,res) =>{
  const uid = req.params.uid
  const pid = req.params.pid
  knex('users').where({spotify_id:uid}).first().then(user => {
    knex('playlists').where({user_id:user.id, spotify_playlist_id:pid}).first().then(playlist => {
      res.send(playlist)
    })
  })
})

module.exports = router
