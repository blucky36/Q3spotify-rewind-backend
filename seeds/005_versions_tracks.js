
exports.seed = function(knex, Promise) {
  return knex('versions_tracks').del()
    .then(function () {
      return knex('versions_tracks').insert([
        {
          id:0,
          version_id:0,
          track_id:0
        },
        {
          id:1,
          version_id:0,
          track_id:1
        },
        {
          id:2,
          version_id:0,
          track_id:2
        },
        {
          id:3,
          version_id:0,
          track_id:3
        },
        {
          id:4,
          version_id:0,
          track_id:4
        },
      ])
    })
    .then(() => {
      return knex.raw("SELECT setval('versions_tracks_id_seq', (SELECT MAX(id) FROM versions_tracks));")
    })
}
