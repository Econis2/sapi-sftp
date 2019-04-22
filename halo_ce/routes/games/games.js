const express = require('express')
const fs = require('fs-extra')
const types = require('./types')
const configs = require('./configs')
const helper = require('../../helper_modules/helper')
const resError = helper.responses.error
const resSuccess = helper.responses.success
const config = helper.config
const router = express.Router()

var userID = ""

//  games/
router.route('/')
.all(( req, res, next )=>{

    userID = helper.setUserId( req )

    // Check if User Exists
    if(helper.userExist( req, config )){ next() }
    // 404 - Resource Not Found
    else{ return resError['404']( res ) }
    
})

.get(( req,res )=>{
    let games = helper.getGames( config, userID )

    if( games ){ return resSuccess['200']( res, games ) }
    else{ return resError['500']( res ) }
})

.post(( req, res )=>{
    // Check if game already exists
    let games = helper.getGames( config, userID ).filter(( game )=>{ return game == req.body.name })

    if( games.length == 0 ){
        let gamePath = config.paths.users + '/' + userID + '/' + req.body.name
        let package = config.paths.packages + '/' + req.body.name
    
        // Make the New (Game) Folder in User Folder 
        fs.mkdirSync( gamePath )
    
        //Copy Game Template to New Game Folder Directory
        fs.copySync( package, gamePath )
    
        // Check that the games folder was created
        let games = helper.getGames( config, userID )
        let game = games.filter(( game )=> { return game == req.body.name })[0]
    
        // 204 - New Game Created
        if( game ){ return resSuccess['204']( res ) }
        // 500 - Internal Server Error
        else{ return resError['500']( res ) }
    }
    // 409 - Resource Exist
    else{ return resError['409']( res ) }

})

//  games/:name
router.route('/:name')
.all(( req, res, next )=>{

    userID = helper.setUserId( req )

    let user = helper.userExist( req, config )
    let game = helper.gameExist( req, config, userID )

    // Continue
    if( user && game ){ next() }
    // 404 - Resource Not Found
    else{ return resError['404']( res ) }
})
.get(( req,res )=>{
    
    let data = helper.getGameDetails( req.params.name, config, userID )
    return resSuccess['200']( res, data )
})

.delete(( req, res )=>{
    
    fs.removeSync( helper.config.paths.users + '/' + userID + '/' + req.params.name )

    let game = helper.getGames( config, userID ).filter(( game ) =>{ return game == req.params.name })

    if( game.length == 0 ){ return resSuccess['204']( res )}
    else{ return resError['500']( res ) }
})

router.use('/:id/configs', configs)
router.use('/:id/types', types)

module.exports = router