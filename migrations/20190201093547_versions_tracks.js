exports.up = knex => {
  return knex.schema.createTable("versions_tracks",(table)=>{
    table.increments("id")
    table.integer("version_id").notNullable()
    table.foreign("version_id").references("versions.id")
    table.integer("track_id").notNullable()
    table.foreign("track_id").references("tracks.id")
  })
}

exports.down = knex => {
  return knex.schema.dropTable("versions_tracks")
}
