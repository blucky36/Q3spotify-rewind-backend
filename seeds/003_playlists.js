
exports.seed = function(knex) {
  return knex('playlists').del()
    .then(function () {
      return knex('playlists').insert([
        {
          id:0,
          user_id:0,
          spotify_playlist_id:'1249465062',
          name: '5rock'
        }
      ]);
    });
};
