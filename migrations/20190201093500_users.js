exports.up = knex => {
  return knex.schema.createTable("users",(table)=>{
    table.increments("id")
    table.string("name").notNullable().defaultsTo("")
    table.string("spotify_id").notNullable()
    table.string("avatar").notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTable("users")
}
