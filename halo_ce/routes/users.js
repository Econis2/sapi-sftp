const express = require('express')
const fs = require('fs')
const helper = require('../helper_modules/helper')
const config = helper.config
const resError = helper.responses.error
const resSuccess = helper.responses.success
const games = require('./games/games')
const router = express.Router()

// api/users
// return array of user GUID
router.route('/')
// GET /users
.get(( req, res )=>{

    let users = helper.getUsers( config )
    if( users ){ return resSuccess['200']( res, users ) }
    else{ return resError['500']( res ) }

})
// POST /users
.post(( req, res )=>{

    let newId = req.body.id

    if( !helper.userExist( newId ) ){
        // Create Folder with User GUID
        fs.mkdirSync( config.paths.users + '/' + newId )
        
        let users = helper.getUsers( config )
        let user = users.filter( (user) => { return user == newId } )[0]

        if( user ){ return resSuccess['204']( res ) }
        else{ return resError['500']( res ) }
    
    }
    else{ return resError['409']( res ) }

})
// USERS/:ID
router.route('/:id')
// ALL /users/:id
.all(( req, res, next ) => {
    if( helper.userExist( req.params.id ) ){ next() }
    else{ return resError['404']( res ) }
})
// GET /users/:id
.get(( req, res )=>{
    let userBase = config.paths.users + '/' + req.params.id

    let games = fs.readdirSync( userBase )

    if( games ){ return resSuccess['200']( res, games ) }
    else{ return resError['500']( res ) }

})
// DELETE /users/:id
.delete(( req, res )=>{
    let userBase = config.paths.users + '/' + req.params.id
    // Remove User Directory
    fs.rmdirSync( userBase )

    let users = helepr.getUsers( config )
    let user = users.filter( ( user ) => { return user == req.body.id } )[0]

    if( !user ){ return resSuccess['204']( res ) }
    else{ return resError['500']( res ) }

})

router.use('/:id/games', games)

module.exports = router