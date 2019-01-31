module.exports = {

  development: {
    client: 'pg',
    connection: 'postgresql://localhost/spotify_rew_dev'
  },
  test: {
    client: 'pg',
    connection: 'postgresql://localhost/spotify_rew_dev'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
}


