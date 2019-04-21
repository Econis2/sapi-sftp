const express = require('express')
const fs = require('fs')
const games = require('./games/games')
const router = express.Router()
const config = JSON.parse(fs.readFileSync('/home/econis/ftp/halo_config.json',{encoding: 'utf-8'}))

function getUsers(){ return fs.readdirSync( config.paths.users ) }

// api/users
// return array of user GUID
router.route('/')

.get((req,res)=>{
    let users = getUsers()
    if(users){
        return res.status(200).send({
            status: "success",
            data: users
        })
    }
    else{
        return res.status(500).send({
            status: "error",
            data: {
                code: 500,
                msg: "Internal Server Error"
            }
        })
    }
})

// Create new user
.post((req,res)=>{
    // Create Folder with User GUID
    fs.mkdirSync(config.paths.users + '/' + req.body.id)

    let users = getUsers()
    let user = users.filter( (user) => { return user == req.body.id } )[0]

    if(user){ return res.status(204).send() }
    else{
        res.statusCode = 404
        return {
            status: "error",
            data: {
                code: 500,
                msg: "Resource not found"
            }
        }
    }

})

// api/users/:id
router.route('/:id')
// return User
// - id
// - games: array[:names]
.get((req,res)=>{
    let userBase = config.paths.users + '/' + req.params.id

    let games = fs.readdirSync(userBase)

    if(games){
        return res.status(200).send({
            status: "success",
            data: games
        })

    }
    else{
        return res.status(500).send({
            status: "error",
            data: {
                code: 500,
                msg: "Internal Server Error"
            }
        })
    }
})

.delete((req,res)=>{
    let userBase = config.paths.users + '/' + req.params.id
    // Remove User Directory
    fs.rmdirSync(userBase)

    let users = getUsers()
    let user = users.filter( (user) => { return user == req.body.id } )[0]

    if(!user){
        return res.status(204).send()
    }
    else{
        return res.status(500).send({
            status: "error",
            data: {
                code: 500,
                msg: "Internal Server Error"
            }
        })
    }

})

router.use('/:id/games', games)

module.exports = router