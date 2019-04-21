const router = require('express').Router()
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('/home/econis/ftp/halo_config.json',{encoding: 'utf-8'}))


// types
router.route('/')
.get((req, res)=>{
    console.log("GET: All Types")
    return res.send("GET: All Types")
})
.post((req, res)=>{
    console.log("POST: Add New Type")
    return res.send("POST: Add New Type")
})

// types/:id
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
