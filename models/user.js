const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;
let jwtsecret = process.env.JWT_SECRET;
let saltRounds = process.env.SALT_ROUNDS || 10;

const userSchema = new Schema({
    username: {type: String, required: true, maxlength: 100},
    password: {type: String, required: true, maxlength: 100},
    isManager: {type: Boolean, required: true},    
    dateadded: {type: Date, default: Date.now},
    datemodified: {type: Date, default: Date.now}
})

userSchema.methods.encryptPassword = async function(){
    let hashedPassword = await bcrypt.hash(this.password, parseInt(saltRounds)).catch((e)=>{console.error(e.message)});
    this.password = hashedPassword;
}

userSchema.methods.validatePassword = async function(password){
    let result = await bcrypt.compare(password, this.password).catch((e)=>{console.error(e.message)});
    return result;
}

userSchema.methods.generateJwtToken = function(){

    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate()+1);

    return jwt.sign({
        id: this._id,
        username: this.username,
        isManager: this.isManager,
        exp: parseInt(expirationDate.getTime()/1000, 10)
    }, jwtsecret);
}

userSchema.methods.toAuthJson = function(){
    return {
        username: this.username,
        _id: this._id,
        token: this.generateJwtToken()
    }
}


module.exports = mongoose.model('User', userSchema);




