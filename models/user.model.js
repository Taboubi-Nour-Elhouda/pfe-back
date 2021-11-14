var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema

var schema = Schema({

    accountname: String,
    firstname: String,
    lastname: String,
    email :String,
    password: String,
    enabled : String,
    cv:String
});
schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);

}
schema.methods.isValid = function (hashedpassword){
    return bcrypt.compareSync(hashedpassword,this.password)
}
module.exports = mongoose.model('User',schema);