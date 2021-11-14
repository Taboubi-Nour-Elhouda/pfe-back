var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/user.model');
var passport  =require('passport');




router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users)
  })
})
router.post('/register', function (req, res, next) {
  addToDB(req, res);
});

async function addToDB(req, res) {
  var user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    accountname: req.body.accountname,
    email: req.body.email,
    password: User.hashPassword(req.body.password),
    enabled: req.body.enabled

  });
  try {
    doc = await user.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); }
    req.logIn(user, function (err) {
      if (err) { return res.status(501).json(err); }
      return res.status(201).json({messge:"login success !"});
    });
  })(req, res, next);
});

router.get('/user', isValidUser, function(req,res,next){
  return res.status(200).json(req.user);
});
function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return  res.status(401).json({message:'Unauthorized Request'})
}

router.get('/logout', isValidUser,function(req,res,next){
  req.logOut();
  return res.status(200).json({message:'Logout success'})
})
module.exports = router;
