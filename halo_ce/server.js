const express = require('express')
const bodyParser = require('body-parser')
//const fs = require('fs-extra')
const helper = require('./helper_modules/helper')
const config = helper.config
const resError = helper.responses.error

const users = require('./routes/users')
var port = 8080

const app = express()

// Get Server Details
//const config = JSON.parse(fs.readFileSync('/home/econis/ftp/halo_config.json',{encoding: 'utf-8'}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Check for Header Credentials
app.use((req, res, next)=>{
    let c_id = req.headers['client_id']
    let c_secret = req.headers['client_secret']
    //if(c_id == config.credential.id && c_secret == config.credential.secret){
        next()
    //}
    /*else{ return resError['401] }*/
})


app.use('/api/users', users)

app.listen(port, ()=>{
    console.log("Running on " + port)
})