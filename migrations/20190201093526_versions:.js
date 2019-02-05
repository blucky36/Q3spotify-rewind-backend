exports.up = knex => {
  return knex.schema.createTable("versions",(table)=>{
    table.increments("id")
    table.integer("playlist_id").notNullable()
    table.string("snapshot_id").notNullable()
    table.foreign("playlist_id").references("playlists.id").onDelete('CASCADE')
    table.string('notes')
    table.timestamps(true,true)
  })
}

exports.down = knex => {
  return knex.schema.dropTable("versions")
}
