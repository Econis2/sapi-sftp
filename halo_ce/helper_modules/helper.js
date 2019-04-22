
const fs = require('fs')

let config = JSON.parse(fs.readFileSync('/home/econis/ftp/halo_config.json',{encoding: 'utf-8'}))
 

module.exports = {

    // Configuration
    config: config,

    responses: {

        error: {
            401: function(res){
                return res.status(401).send({
                    status: "error",
                    error:{
                        code: 401,
                        msg: "Unauthorized"
                    }
                })
            },
            404: function(res){
                return res.status(404).send({
                    status: 'error',
                    data: {
                        code: 404,
                        msg: "Resource Not Found"
                    }
                })
            },
            409: function(res){
                return res.status(409).send({
                    status: 'error',
                    data: {
                        code: 409,
                        msg: "Conflict"
                    }
                })
            },
            500: function(res){
                return res.status(500).send({
                    status: 500,
                    data: {
                        code: 500,
                        msg: "Internal Server Error"
                    }
                })
            }
        },
        success: {
            200: function(res, data){
                return res.status(200).send({
                    status: "success",
                    data: data
                })
            },
            204: function(res){
                return res.status(204).send()
            }
        }
    },

    // Generic
    setUserId: function(req){
        return req.originalUrl.split('/')[3]
    },

    // User Functions
    getUsers: function(config){
        return fs.readdirSync( config.paths.users )
    },

    userExist: function(req, config){
        
        userID = req.originalUrl.split('/')[3]

        let user = fs.readdirSync(config.paths.users).filter((user) => { return user == userID})
        
        if(user.length != 0){
            return true
        }
        else{
            return false
        }
    },

    // Game Functions
    gameExist: function(req, config, userID){
        let gameName = req.params.name

        // see if game folder exists
        let game = this.getGames(config, userID).filter((game) => { return game == gameName })
    
        if(game != 0){
            return true
        }
        else{
            return false
        }
    },

    getGameDetails: function(gameName, config, userID){
        
        let gamePaths = config.gamePaths[gameName]

        if(gamePaths){
            let gameFolders = Object.keys(gamePaths)
            let basePath = config.paths.users + '/' + userID + '/' + gameName
        
            let data = {}
        
    
            gameFolders.forEach((folder) =>{ 
                
                let tmp = []
                let contents = fs.readdirSync(basePath + gamePaths[folder])
                
                if(contents){
                    contents.forEach((file)=>{
                        tmp.push(file.split('.')[0])
                    })
                }
        
                data[folder] =  tmp
            
            })
        
            return data
        }
        else{
            return {}
        }

    },

    getGames: function(config, userID){
        return fs.readdirSync(config.paths.users + '/' + userID)
    },

    




}