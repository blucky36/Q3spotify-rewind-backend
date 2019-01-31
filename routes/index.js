var express = require('express');
var router = express.Router();
const passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/spotify', passport.authenticate('spotify', { scope: ['playlist-read-private'], showDialog:true }))


router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/', session: false }), (req, res) => {
    const token = req.user.token
    const id = req.user.spotifyId
    res.redirect(`http://localhost:3000/userhome?token=${token}&id=${id}`)
  })

  router.get('/userhome', (req,res) => {
    const token = req.query.token
    console.log(req.user)
    res.send({token, userdata:req.userData})
  })


module.exports = router;
