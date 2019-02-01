exports.up = knex => {
  return knex.schema.createTable("playlists",(table)=>{
    table.increments("id")
    table.integer("user_id").notNullable()
    table.foreign("user_id").references("users.id").onDelete('CASCADE')
    table.string("spotify_playlist_id").notNullable()
    table.string("name").notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTable("playlists")
}
