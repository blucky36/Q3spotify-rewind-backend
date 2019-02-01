exports.seed = function(knex) {
  return knex('users').del()
    .then(function() {
      return knex('users').insert([{
        id: 1,
        name: 'Paul Mourer',
        spotify_id: '1249465062',
        avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/14681797_1210354055691745_553932392514557874_n.jpg?_nc_cat=106&_nc_ht=scontent.xx&oh=57abd247553d36b150f3547e00dec1ed&oe=5CB9CFBC'
      },
      {
        id: 2,
        name: 'Blake Bollman',
        spotify_id: '1221476620',
        avatar: 'https://i5.walmartimages.com/asr/80850417-1302-429b-abbc-6ecdd5042319_1.2dfc1c7bcb8727e589264c1707e86e63.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF'
      },
      {
        id:3,
        name: 'Tucker Nemcek',
        spotify_id:'tuckernemcek22',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5TZcoTN4nJ0kxBe9hTKXoSMlwlgsQ05QT-WrssZMmQuo0ZER'
      }]);
    })
    .then(() => {
      return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));")
    })
};
