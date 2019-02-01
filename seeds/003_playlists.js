
exports.seed = function(knex) {
  return knex('playlists').del()
    .then(function () {
      return knex('playlists').insert([
        {
          id:0,
          user_id:0,
          spotify_playlist_id:'19qKzDBqnI0GKkGzU8Owcw',
          name: '5rock'
        }
      ]);
    });
};
