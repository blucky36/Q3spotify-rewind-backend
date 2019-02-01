
exports.seed = function(knex) {
  return knex('playlists').del()
    .then(function () {
      return knex('playlists').insert([
        {
          id:1,
          user_id:1,
          spotify_playlist_id:'19qKzDBqnI0GKkGzU8Owcw',
          name: '5rock'
        }
      ])
    })
    .then(() => {
      return knex.raw("SELECT setval('playlists_id_seq', (SELECT MAX(id) FROM playlists));")
    })
}
