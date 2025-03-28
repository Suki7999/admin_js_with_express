const mongoose = require('mongoose')
const uri = 'mongodb://localhost/TTsss'
mongoose.connect(uri)
const conexion = mongoose.connection

module.exports = conexion
