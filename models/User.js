const mongoose = require("mongoose")
const { required } = require("nodemon/lib/config")

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer",
        required: true
    }
})


module.exports = mongoose.model("User", userSchema)