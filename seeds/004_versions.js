
exports.seed = function(knex, Promise) {
  return knex('versions').del()
    .then(function () {
      return knex('versions').insert([
        {
          id:0,
          playlist_id:0,
        }
      ])
    })
    .then(() => {
      return knex.raw("SELECT setval('versions_id_seq', (SELECT MAX(id) FROM versions));")
    })
}
