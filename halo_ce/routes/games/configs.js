const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const helper = require('../../helper_modules/helper')
const config = helper.config
const resError = helper.responses.error
const resSuccess = helper.responses.success
var userID = ""
var gameName = ""
var configID = ""


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

    let configs = helper.getConfigs( config, userID, gameName )

    return resSuccess['200']( res, configs )

})
.post((req, res)=>{
    console.log("POST: Add New Type")
    return res.send("POST: Add New Type")
})

// configs/:id
router.route('/:id')
.all(( req, res, next )=>{
    userID = helper.setUserId( req )
    gameName = helper.setGameName( req )
    configID = helper.setConfigId( req )

    let user = helper.userExist( userID, config )
    let game =  helper.gameExist( gameName, config, userID )
    let config = helper.configExist( config, userID, gameName, configID)

    // Continue
    if( user && game && config ){ next() }
    // 404 - Resource Not Found
    else{ return resError['404']( res ) }

})
.get((req, res)=>{
    let config = helper.getConfig(config, userID, gameName, configID )

    if(config){ return resSuccess['200']( res, config ) }
    else{ return resError['500']( res ) }

})
.delete((req, res)=>{
    console.log("DELETE: ID: " + configID)

    let configPath = path.join( config.paths.users, userID, gameName, configs, configID )

    fs.rmdirSync( configPath )

    if(helper.configExist( config, userID, gameName, configID )){ return resError['500']( res ) }
    else{ return resSuccess['204']( res ) }

})

module.exports = router
