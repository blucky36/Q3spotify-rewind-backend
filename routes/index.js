var express = require('express');
var router = express.Router();
const passport = require('passport')
const scope = ['playlist-read-private','playlist-modify-private','playlist-modify-public','playlist-read-collaborative']


require('dotenv').config()
const appUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_URL : 'http://localhost:3000'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/spotify', passport.authenticate('spotify', { scope, showDialog:true }))


router.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/', session: false }), (req, res) => {
    const accessToken = req.user.accessToken
    const refreshToken = req.user.refreshToken
    const userId = req.user.profile.id
    res.redirect(`${appUrl}/login?accessToken=${accessToken}&userId=${userId}`)
  })

  router.get('/login', (req,res) => {
    const token = req.query.accessToken
    const userId = req.query.userId
    res.send({token, userId})
  })


module.exports = router;
