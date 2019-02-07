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
    console.log(uid)
    knex('users').where({ spotify_id: uid }).first().then(user => {
      console.log(user)
      knex('playlists').where({ user_id: user.id }).then(playlists => {
        res.send(playlists)
      })
    })
  })

  .post("/users/:uid/playlists", (req, res, next) => {
    const spotify_id = req.params.uid
    const {
      snapshot_id = 'default',
      spotify_playlist_id,
      name,
      notes,
      trackArray
    } = req.body
    console.log("here");
    if (!spotify_playlist_id || !name || !spotify_id || !notes || !trackArray) return
    knex('playlists').where({ spotify_playlist_id }).then(playlists => {
      if (playlists.length > 0) throw new Error('playlist exists')
    }).then(() => {
      console.log("passes error handling");
      knex('users').where({ spotify_id }).first().then(user => {
        console.log("inserts user");
        return knex("playlists").insert({ spotify_playlist_id, name, user_id: user.id }).returning("*").then(playlist => {
          console.log("inserts playlist");
          return knex("versions").insert({ playlist_id: playlist[0].id, notes, snapshot_id }).returning("*").then(version => {
            console.log("inserts versions");
            trackArray.forEach(track => {
              knex("tracks").insert({ spotify_uri: track.track.uri, name: track.track.name, artist: track.track.artists[0].name, spotify_id: track.track.id, preview: track.track.preview_url, cover: track.track.album.images[0].url }).returning("*").then(t => {
                knex("versions_tracks").insert({ version_id: version[0].id, track_id: t[0].id }).returning("*").then(data => {})
              })
            })
            return version[0]
          })
        })
      })
    }).catch(next).then(ver => res.status(201).send(ver))
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
      snapshot_id='1234',
      notes,
      trackArray
    } = req.body

    knex("playlists").where({ spotify_playlist_id }).returning("*").first().then(playlist => {
      return knex("versions").where({ snapshot_id }).returning("*").then(versions => {
        if (versions.length === 0) {
          return knex("versions").insert({ playlist_id: playlist.id, snapshot_id, notes, }).returning('*').then(version => {

            trackArray.forEach(track => {
              knex("tracks").insert({ spotify_uri: track.track.uri, name: track.track.name, artist: track.track.artists[0].name, spotify_id: track.track.id, preview: track.track.preview_url, cover: track.track.album.images[0].url }).returning("*").then(t => {
                knex("versions_tracks").insert({ version_id: version[0].id, track_id: t[0].id }).returning("*").then(data => {})
              })
            })
            return version[0]
          })
        } else {
          return {error: 'Version already exists', ...versions[0]}
        }
      })
    }).then(ver => res.status(201).send(ver))
  })

  .get("/users/:uid/all", (req, res) => {
    let tracksObj = {}
    return knex("users").where("users.spotify_id", req.params.uid).first().then(user => {
      return knex("playlists").where({ "playlists.user_id": user.id }).then(pArr => {
        let pArrIds = pArr.map(p => p.id)
        return knex("versions").whereIn("playlist_id", pArrIds).then(verArr => {
          return Promise.all([...verArr.map((v) => {
            return knex("versions_tracks").where({ "versions_tracks.version_id": v.id })
              .innerJoin("tracks", "versions_tracks.track_id", "tracks.id").then(trackArr => {
                return [trackArr, v.id]
              })
          }, {})]).then(tracks => ({
            tracks: tracks.reduce((accum, t, i) => {
              accum[t[1]] = t[0]
              return accum
            }, {}),
            verArr,
            pArr,
            user
          }))
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

  .get("/users/:uid/all", (req, res) => {
    let tracksObj = {}
    return knex("users").where("users.spotify_id", req.params.uid).first().then(user => {
      return knex("playlists").where({ "playlists.user_id": user.id }).then(pArr => {
        let pArrIds = pArr.map(p => p.id)
        return knex("versions").whereIn("playlist_id", pArrIds).then(verArr => {
          console.log(verArr)
          return Promise.all([...verArr.map((v) => {
            return knex("versions_tracks").where({ "versions_tracks.version_id": v.id })
              .innerJoin("tracks", "versions_tracks.track_id", "tracks.id").then(trackArr => {
                return [trackArr, v.id]
              })
          }, {})]).then(tracks => ({
            tracks: tracks.reduce((accum, t, i) => {
              accum[t[1]] = t[0]
              return accum
            }, {}),
            verArr,
            pArr,
            user
          }))
        })
      })
    }).then(oi => {
      res.status(200).send({ ...oi })
    })
  })

module.exports = router
