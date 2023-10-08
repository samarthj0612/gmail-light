var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/gmail');

var userSchema = mongoose.Schema({
  name : String,
  username : String,
  dob : String,
  blood : String,
  gender : String,
  mobile : String,
  email : String,
  profilePic : {
    type : String,
    default : "user.png"
  },
  sentMails : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "mail"
  }],
  receivedMails : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "mail"
  }],
  password : String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);