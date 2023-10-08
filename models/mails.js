var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gmail');

var mailSchema = mongoose.Schema({
  status : {
    type : Boolean,
    default : false
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  },
  receiver : String,
  mailText : String
})

module.exports = mongoose.model('mail', mailSchema);