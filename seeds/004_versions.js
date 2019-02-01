
exports.seed = function(knex, Promise) {
  return knex('versions').del()
    .then(function () {
      return knex('versions').insert([
        {
          id:0,
          playlist_id:0,
        }
      ]);
    });
};
