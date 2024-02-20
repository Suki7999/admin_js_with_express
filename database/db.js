const mongoose = require('mongoose')
const uri = 'mongodb://localhost/adminpanel'
mongoose.connect(uri)
const conexion = mongoose.connection

module.exports = conexion
