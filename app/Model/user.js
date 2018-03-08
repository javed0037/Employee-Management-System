var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminrcd = new Schema({
  FirstName : { type : String ,unique : true},
  LastName  : { type : String },
  Phone     : { type : Number,unique : true },
  Image     : { type : String  },
  Password  : { type : String  },
  AccountType : { type : String ,
                   enum ['Admin','Hr','Employee'],
                   default : Employee },
  Verifymail :  { verificationStatus : { type : Boolean , defaults : false },
                   email : type : String },

  CreatedAt :  { type  : date ,default :Date.now },
  IsDelete :   { type : Boolean , defaults : false }

})

module.exports = mongoose.model('companyRecord',adminrcd);
