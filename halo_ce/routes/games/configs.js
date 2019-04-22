const router = require('express').Router()
const fs = require('fs')
const helper = require('../../helper_modules/helper')
const config = helper.config
const resError = helper.responses.error
const resSuccess = helper.responses.success
var userID = ""
var gameName = ""


// configs
router.route('/')
.all(( req, res, next )=>{

    userID = helper.setUserId( req )
    gameName = helper.setGameName( req )

    let user = helper.userExist( userID, config )
    let game = helper.gameExist( gameName, config, userID )

    console.log("User: " + user)
    console.log("Game: " + game)

    // Continue
    if( user && game ){ next() }
    // 404 - Resource Not Found
    else{ return resError['404']( res ) }

})
.get(( req, res )=>{
    console.log("GET: All configs")
    // Set File Path /users/{ userID }/configs
    let path = config.paths.users + '/' + userID + '/' + gameName + '/configs'   

    // Read File
    let temp = fs.readdirSync( path )

    let configs = []

    temp.forEach(( config )=> { configs.push( config.split('.txt')[0] ) })

    return resSuccess['200'](res, configs)

})
.post((req, res)=>{
    console.log("POST: Add New Type")
    return res.send("POST: Add New Type")
})

// configs/:id
router.route('/:id')
.get((req, res)=>{
    console.log("GET: ID: " + req.params.id)
    return res.send("GET: ID: " + req.params.id)
})
.delete((req, res)=>{
    console.log("DELETE: ID: " + req.params.id)
    return res.send("DELETE: ID: " + req.params.id)
})

module.exports = router
