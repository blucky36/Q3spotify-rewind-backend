var express = require('express');
var router = express.Router();
const knex = require('../knex')



router.get('/users/:uid', (req, res) => {
    const uid = req.params.uid
    knex('users').where({ spotify_id: uid }).first().then(user => {
      res.send(user)
    })
  })

  .get('/users/:uid/playlists/', (req, res) => {
    const uid = req.params.uid
    knex('users').where({ spotify_id: uid }).first().then(user => {
      knex('playlists').where({ user_id: user.id }).then(playlists => {
        res.send(playlists)
      })
    })
  })

  .get('/users/:uid/playlists/:pid', (req, res) => {
    const uid = req.params.uid
    const pid = req.params.pid
    knex('users').where({ spotify_id: uid }).first().then(user => {
      knex('playlists').where({ user_id: user.id, spotify_playlist_id: pid }).first().then(playlist => {
        res.send(playlist)
      })
    })
  })

  .delete('/users/:uid/playlists/:pid', (req, res) => {
    const uid = req.params.uid
    const pid = req.params.pid
    knex('users').where({ spotify_id: uid }).first().then(user => {
      knex('playlists').where({ user_id: user.id, spotify_playlist_id: pid }).first().del().returning('*').then(playlist => {
        res.send(playlist)
      })
    })
  })

  .get('/users/:uid/playlists/:pid/versions/:vid', (req, res) => {
    const uid = req.params.uid
    const pid = req.params.pid
    const vid = req.params.vid
    knex('versions_tracks').innerJoin('versions', 'versions_tracks.version_id', 'versions.id')
      .innerJoin('tracks', 'versions_tracks.track_id', 'tracks.id').where({ version_id: vid }).then(tracks => {
        res.send(tracks)
      })
  })

  .get('/users/:uid/playlists/:pid/versions', (req, res) => {
    const uid = req.params.uid
    const pid = req.params.pid
    knex('users').where({ spotify_id: uid }).first().then(user => {
      knex('playlists').where({ user_id: user.id, spotify_playlist_id: pid }).first().then(playlist => {
        knex('versions').where({ playlist_id: playlist.id }).then(versions => {
          res.send(versions)
        })
      })
    })
  })

  .delete('/users/:uid/playlists/:pid/versions/:vid', (req, res) => {
    const vid = req.params.vid
    knex('versions').where({'versions.id':vid}).del().returning('*').then(version => {
      res.send(version)
    })
  })


  .get('/tracks/')

module.exports = router
