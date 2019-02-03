
exports.seed = function(knex) {
  return knex('tracks').del()
    .then(function () {
      return knex('tracks').insert([
        {
          id:1,
          spotify_id: '0KB8axjVQMdjcASPr2sVzn',
          spotify_uri: 'spotify:track:0KB8axjVQMdjcASPr2sVzn',
          name: "stairway to heaven",
          artist: "ledzepps"
        },
        {
          id:2,
          spotify_id: '2t5GyUfFoZg3E8ak3i7dVP',
          spotify_uri: 'spotify:track:2t5GyUfFoZg3E8ak3i7dVP',
          name: "stairway to heaven",
          artist: "ledzepps"
        },
        {
          id:3,
          spotify_id: '6Vjk8MNXpQpi0F4BefdTyq',
          spotify_uri: 'spotify:track:6Vjk8MNXpQpi0F4BefdTyq',
          name: "stairway to heaven",
          artist: "ledzepps"
        },
        {
          id:4,
          spotify_id: '0auKlivXpm76wR63mMJ3pR',
          spotify_uri: 'spotify:track:0auKlivXpm76wR63mMJ3pR',
          name: "stairway to heaven",
          artist: "ledzepps"
        },
        {
          id:5,
          spotify_id: '5UgT7w6zVZjP3oyawMzbiK',
          spotify_uri: 'spotify:track:5UgT7w6zVZjP3oyawMzbiK',
          name: "stairway to heaven",
          artist: "ledzepps"
        },
      ])
    })
    .then(() => {
      return knex.raw("SELECT setval('tracks_id_seq', (SELECT MAX(id) FROM tracks));")
    })
}
