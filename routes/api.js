var express = require('express');
var router = express.Router();
const knex = require('../knex')



router.get('/users/:uid',(req,res) => {
  const uid = req.params.uid
  knex('users').where({ spotify_id: uid}).first().then(user => {
    res.send(user)
  })
})

module.exports = router
