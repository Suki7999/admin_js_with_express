const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    ism : String,
    yoshi: {type: Number, min:15},
    region:String,
    
})
module.exports = mongoose.model('User', UserSchema)