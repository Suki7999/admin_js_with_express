const express = require('express')
const app = express()


const conexion = require('./database/db')
conexion.once('open', ()=> console.log('Mongo ishladi'))
conexion.on('error', ()=> console.log('ishladi '+error))

//AdminBro
const AdminBro = require('admin-bro')
const expressAdminBro = require('@admin-bro/express')
const mongooseAdminBro = require('@admin-bro/mongoose')

    
//Models
const User = require('./models/User')
const Post = require('./models/Post')

AdminBro.registerAdapter(mongooseAdminBro)
const AdminBroOptions = {resources: [User, Post]}

const adminBro = new AdminBro(AdminBroOptions)
const router = expressAdminBro.buildRouter(adminBro) 
app.use(adminBro.options.rootPath, router)


app.get('/', (req, res)=>{
    res.send('SALOM')
})
app.listen(3000, ()=>{
    console.log('Admin panel ishaladi')
})  