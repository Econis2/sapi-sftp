const router = require('express').Router()
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('/home/econis/ftp/halo_config.json',{encoding: 'utf-8'}))


function getConfigs(){

    //fs.readdirSync('Z:\\')

}

function parseConfig(){

}


// configs
router.route('/')
.get((req, res)=>{
    console.log("GET: All configs")
    let userId = req.originalUrl.split('/')[3]
    
    'Z:\\users\\' + userId + '\\' + 
    
    console.log(userId)
    return res.send("GET: All configs")
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
