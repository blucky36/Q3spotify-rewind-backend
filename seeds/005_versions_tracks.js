
exports.seed = function(knex, Promise) {
  return knex('versions_tracks').del()
    .then(function () {
      return knex('versions_tracks').insert([
        {
          id:1,
          version_id:1,
          track_id:1
        },
        {
          id:2,
          version_id:1,
          track_id:2
        },
        {
          id:3,
          version_id:1,
          track_id:3
        },
        {
          id:4,
          version_id:1,
          track_id:4
        },
        {
          id:5,
          version_id:1,
          track_id:5
        },
      ])
    })
    .then(() => {
      return knex.raw("SELECT setval('versions_tracks_id_seq', (SELECT MAX(id) FROM versions_tracks));")
    })
}
