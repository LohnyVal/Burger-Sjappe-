const express = require("express")
const argon2 = require("argon2")
const mongoose = require("mongoose")

const mongodb = mongoose.connect("")



const app = express()





app.listen(4000, () =>{
    console.log("http://localhost:4000")
})