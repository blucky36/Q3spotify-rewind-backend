exports.up = knex => {
  return knex.schema.createTable("versions_tracks",(table)=>{
    table.increments("id")
    table.integer("version_id").notNullable()
    table.foreign("version_id").references("versions.id").onDelete('CASCADE')
    table.integer("track_id").notNullable()
    table.foreign("track_id").references("tracks.id").onDelete('CASCADE')
  })
}

exports.down = knex => {
  return knex.schema.dropTable("versions_tracks")
}
