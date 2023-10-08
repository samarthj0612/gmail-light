var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var mailModel = require('../models/mails');
var passport = require('passport');
const localStrategy = require("passport-local");
const multer = require('multer');

passport.use(new localStrategy(userModel.authenticate()));

function fileFilter(req, file, cb){
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp' || file.mimetype === 'image/png' || file.mimetype === 'image/svg'){
    cb(null, true);
  }
  else{
    cb(new Error("File extension is invalid"));
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    console.log(file);
    const fn = Date.now() + Math.floor(Math.random()*10000) + file.originalname
    cb(null, fn);
  }
})

const upload = multer({ storage: storage, fileFilter : fileFilter });

router.get('/check/:username', async function(req, res, next){
  let user = await userModel.findOne({username : req.params.username})
  res.json({user});
})

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', function(req, res){
  if(req.body.password === req.body.confirmPassword){
    var userData = new userModel({
      name : req.body.name,
      username : req.body.username,
      dob : req.body.dob,
      blood : req.body.blood,
      gender : req.body.gender,
      mobile : req.body.mobile,
      email : req.body.email
    })
    userModel.register(userData, req.body.password)
    .then(function(registeredUser){
      passport.authenticate('local')(req, res, function(){
        res.redirect('/receivedMails');
      })
    })
    .catch(function (e) {
      res.send(e);
    });
  }
})

router.get('/receivedMails', isLoggedIn , async function(req, res){
  userModel.findOne({username : req.session.passport.user})
  .populate({
    path : "receivedMails",
  populate : {
    path : "userId"
  }
})
  .then(function(loggedInUser){
    res.render("receivedMails", {user : loggedInUser});
    // res.send(loggedInUser);
  })
})

router.get('/sentMails', isLoggedIn , async function(req, res){
  userModel.findOne({username : req.session.passport.user})
  .populate({
    path : "sentMails",
    populate : {
    path : "userId"
  }
})
  .then(function(loggedInUser){
    res.render("sentMails", {user : loggedInUser});
    // res.send(loggedInUser);
  })
})

router.get('/delete/mail/:id', function(req, res){
  mailModel.findOneAndDelete({_id : req.params.id})
  .then(function(deletedMail){
    res.redirect("back");
  })
})

router.get('/read/mail/:id', async function(req, res){
    mailModel.findOne({_id : req.params.id})
    .populate("userId")
    .then(function(foundMail){
      // res.send(foundMail);
      foundMail.status = true;
      foundMail.save();
      res.render("readMail", {mail : foundMail});
    })
})

router.post('/compose', async function(req, res){
    const loggedInUser = await userModel.findOne({username : req.session.passport.user});
    var mailData = await mailModel.create({
      userId : loggedInUser._id,
      receiver : req.body.receiverMail,
      mailText : req.body.message
    })
    loggedInUser.sentMails.push(mailData._id);
    const loggedInUserUpdated = await loggedInUser.save();

    const receiver = await userModel.findOne({email : req.body.receiverMail});
    receiver.receivedMails.push(mailData._id);

    const updatedReceiver = await receiver.save();

    res.redirect("back");
})

router.get("/profile", isLoggedIn, function(req, res){
  userModel.findOne({username : req.session.passport.user})
  .then(function(userData){
    res.render("profile", {user : userData});
  })
})

router.post('/profilePicUpload', isLoggedIn, upload.single('pic'), async function(req, res){
  const loggedInUser = await userModel.findOne({username : req.session.passport.user});
  loggedInUser.profilePic = req.file.filename;
  await loggedInUser.save();
  res.redirect(req.headers.referer);
})

router.get('/login', function(req, res){
  res.render('login');
})

router.post('/login', passport.authenticate('local', 
{
  successRedirect : '/receivedMails',
  failureRedirect : '/'
}), function(req, res, next){})

router.get('/logout', function(req, res, next){
  req.logOut(function(err){
    if(err) throw err
    res.redirect('/login');
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/login');
  }
}

module.exports = router;