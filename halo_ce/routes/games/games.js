const express = require('express')
const types = require('./types')
const configs = require('./configs')
const router = express.Router()
const fs = require('fs-extra')
const config = JSON.parse(fs.readFileSync('/home/econis/ftp/halo_config.json',{encoding: 'utf-8'}))
var userID = ""

function getGames(){
    return fs.readdirSync(config.paths.users + '/' + userID)
}

//  games/
router.route('/')
.all((req,res,next)=>{
    // Parses the User ID
    userID = req.originalUrl.split('/')[3]

    // see if user exists
    let user = fs.readdirSync(config.paths.users).filter((user) => { return user == userID})
    if(user){
        next()
    }
    // 404 - Resource Not Found
    // cannot find User
    else{
        res.status(404).send({
            status: 'error',
            data: {
                code: 404,
                msg: "Resource Not Found [USER]"
            }
        })
    }
    
})

.get((req,res)=>{
    let games = getGames()

    if(games){
        return res.status(200).send({
            status: "success",
            data: games
        })
    }
    else{
        return res.status(500).send({
            status: 500,
            data: {
                code: 500,
                msg: "Internal Server Error"
            }
        })
    }
})

.post((req,res)=>{
    console.log("POST: Add New game")

    let gamePath = config.paths.users + '/' + userID + '/' + req.body.name
    let package = config.paths.packages + '/' + req.body.name
    // Make the New (Game) Folder in User Folder 
    fs.mkdirSync(gamePath)

    //Copy Game Template to New Game Folder Directory
    fs.copySync(package, gamePath)

    // Check that the games folder was created
    let games = getGames()
    let game = games.filter((game)=> { return game == req.body.name } )[0]

    if(game){
        return res.status(204).send()
    }
    // 500 - Internal Server Error
    else{
        res.status(500).send({
            status: 'error',
            data: {
                code: 500,
                msg: "Internal Server Error"
            }
        })
    }

})

//  games/:name
router.route('/:name')
.all((req,res,next)=>{
    userID = req.originalUrl.split('/')[3]

    // see if user exists
    let user = fs.readdirSync(config.paths.users).filter((user) => { return user == userID})
    if(user){
        next()
    }
    // 404 - Resource Not Found
    // cannot find User
    else{
        res.status(404).send({
            status: 'error',
            data: {
                code: 404,
                msg: "Resource Not Found [USER]"
            }
        })
    }
})
.get((req,res)=>{

    let gamePaths = config.gamePaths[req.params.name]
    let gameFolders = Object.keys(gamePaths)
    let basePath = config.paths.users + '/' + userID + '/' + req.params.name
    let data = {}

    gameFolders.forEach((folder) =>{ 
        
        let tmp = []
        let contents = fs.readdirSync(basePath + '/' + gamePaths[folder])
        
        if(content){
            contents.forEach((file)=>{
                tmp.push(file.split('.')[0])
            })
        }

        data[folder] =  tmp
    
    })

    return res.status(200).send({
        status: "success",
        data: data
    })

})

.delete((req,res)=>{
    
    fs.removeSync(config.paths.users + '/' + userID + '/' + req.params.name)

    let game = getGames().filter((game) =>{
        return game == req.params.name
    })

    if(game.length == 0){
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

router.use('/:id/configs', configs)
router.use('/:id/types', types)

module.exports = router