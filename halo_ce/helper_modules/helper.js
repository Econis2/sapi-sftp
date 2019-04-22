
const fs = require('fs')
const path = require('path')

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
    setUserId: function(req){ return req.originalUrl.split('/')[3] },

    setGameName: function( req ){ return req.originalUrl.split('/')[5] },

    setConfigId: function( req ){ return req.originalUrl.split('/')[7] },

    // User Functions
    getUsers: function(config){
        return fs.readdirSync( config.paths.users )
    },

    userExist: function(id, config){ return fs.existsSync( path.join( config.paths.users, id ) ) },

    // Game Functions
    gameExist: function(gameName, config, userID){ return fs.existsSync( path.join( config.paths.users, userID, gameName ) ) },

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

    // Config Functions
    configExist: function( config, userID, gameName, configID ){ return fs.existsSync( path.join( config.paths.users, userID, gameName, 'configs', configID ) ) },

    getConfigs: function( config, userID, gameName){

        // Set File Path /users/{ userID }/configs
        let path = config.paths.users + '/' + userID + '/' + gameName + '/configs'

        // Read File
        let configs = fs.readdirSync( path )

        return configs
    },

    getConfig: function( config, userID, gameName, configId ){

        let configPath = path.join(config.path.users, userID, gameName, 'configs', configId)

        return this.parseConfig( fs.readFileSync( configPath, 'utf16le').split('\n') )
    },

    parseConfig: function( file ){

        let configObject = {}
        let currentProp = ""
        
        file.forEach(( line )=> {
            
            if( line.endsWith(']') ){
    
                currentProp = line.replace('[','').replace(']','')
    
                configObject[currentProp] = {}
            }
            else if( line ){
                
                let lineArray = line.split(' ')
                
                if(lineArray.length == 3){
                    configObject[currentProp] = {
                        name: lineArray[1],
                        type: lineArray[2]
                    }
                }
                else if( lineArray.length == 1){
                    let key = lineArray[0].replace('sv_','')
                    configObject[currentProp][key] = true
                }
                else{
                    let key = lineArray[0].replace('sv_','')
                    configObject[currentProp][key] = lineArray[1]
                }
    
            }
        })
        
        return configObject
    }


}