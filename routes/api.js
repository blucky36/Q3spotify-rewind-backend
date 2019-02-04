var express = require('express');
var router = express.Router();
const knex = require('../knex')



router.get('/users', (req, res) => {
    knex('users').then(users => {
      res.send(users)
    })
  })

  .delete('/users/:uid', (req, res) => {
    const uid = req.params.uid
    knex('users').where({ spotify_id: uid }).first().del().returning('*').first().then(user => {
      res.send(user)
    })
  })

  .get('/users/:uid', (req, res) => {
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

  .post("/users/:uid/playlists", (req, res) => {
    const spotify_id = req.params.uid
    const {
      spotify_playlist_id,
      name,
      notes,
      trackArray
    } = req.body
    if (!spotify_playlist_id || !name || !spotify_id || !notes || !trackArray) return
    knex('users').where({ spotify_id }).first().then(user => {
      return knex("playlists").insert({ spotify_playlist_id, name, user_id: user.id }).returning("*").then(playlist => {
        return knex("versions").insert({ playlist_id: playlist[0].id, notes }).returning("*").then(version => {
          trackArray.forEach(track => {
            knex("tracks").insert({ spotify_uri: track.track.uri, name: track.track.name, artist: track.track.artists[0].name, spotify_id: track.track.id }).returning("*").then(t => {
              knex("versions_tracks").insert({ version_id: version[0].id, track_id: t[0].id }).returning("*").then(data => {})
            })
          })
          return version[0]
        })
      })
    }).then(ver => res.status(201).send(ver))
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

  .post('/users/:uid/playlists/:pid/versions', (req, res) => {
    const spotify_id = req.params.uid
    const spotify_playlist_id = req.params.pid
    const {
      notes,
      trackArray
    } = req.body
    knex("playlists").where({ spotify_playlist_id }).returning("*").first().then(playlist => {
      return knex("versions").insert({ playlist_id: playlist.id, notes }).returning("*").then(version => {
        trackArray.forEach(track => {
          knex("tracks").insert({ spotify_uri: track.track.uri, name: track.track.name, artist: track.track.artists[0].name, spotify_id: track.track.id }).returning("*").then(t => {
            knex("versions_tracks").insert({ version_id: version[0].id, track_id: t[0].id }).returning("*").then(data => {})
          })
        })
        return version[0]
      })
    }).then(ver => res.status(201).send(ver))
  })

  .get("/users/:uid/all", (req, res) => {
    knex("users").where("users.spotify_id", req.params.uid).first().then(user => {
      return knex("playlists").where({ "playlists.user_id": user.id }).then(pArr => {
        let pArrIds = pArr.map(p => p.id)
        return knex("versions").whereIn("playlist_id", pArrIds).then(verArr => {
          return Promise.all([...verArr.map((v) => {
            return knex("versions_tracks").where({ "versions_tracks.version_id": v.id })
              .innerJoin("tracks", "versions_tracks.track_id", "tracks.id").then(trackArr => {
                return [trackArr, v.id]
              })
          }, {})]).then(tracksStuff => {
            const tracks =
              tracksStuff.reduce((accum, t, i) => {
                accum[t[1]] = t[0]
                return accum
              }, {})
            return { tracks, verArr, pArr, user }
          })
        })
      })
    }).then(oi => {
      res.status(200).send({ ...oi })
    })
  })

  .delete('/users/:uid/playlists/:pid/versions/:vid', (req, res) => {
    const vid = req.params.vid
    knex('versions').where({ 'versions.id': vid }).del().returning('*').then(version => {
      res.send(version)
    })
  })

module.exports = router
