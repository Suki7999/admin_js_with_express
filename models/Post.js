const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    mahsulot : {type: String, required:true},    
    tarkibi: {type: String, required:true}
})
module.exports = mongoose.model('Post', PostSchema)