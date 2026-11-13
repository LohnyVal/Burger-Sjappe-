const mongoose = require("mongoose");


const burgerSchema = mongoose.Schema({
    imageurl: String,
    title: String,
    description: String,
    ingrediens: String,
    category: String,
    price: Number
})



const burger = mongoose.model("burger", burgerSchema)

module.exports = burger;