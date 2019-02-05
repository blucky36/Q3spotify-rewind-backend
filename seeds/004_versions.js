
exports.seed = function(knex, Promise) {
  return knex('versions').del()
    .then(function () {
      return knex('versions').insert([
        {
          id:1,
          snapshot_id: 'aaaaaaaaa',
          playlist_id:1,
          notes:'first version',
        }
      ])
    })
    .then(() => {
      return knex.raw("SELECT setval('versions_id_seq', (SELECT MAX(id) FROM versions));")
    })
}
