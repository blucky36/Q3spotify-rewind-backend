exports.up = knex => {
  return knex.schema.createTable("tracks",(table)=>{
    table.increments("id")
    table.string("spotify_id").notNullable()
    table.string("spotify_uri").notNullable()
    table.string("name").notNullable()
    table.string("artist").notNullable()
    table.string("preview").defaultsTo("")
    table.string("cover").defaultsTo("")
  })
}

exports.down = knex => {
  return knex.schema.dropTable("tracks")
}
