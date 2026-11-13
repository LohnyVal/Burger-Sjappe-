const express = require("express");
const argon2 = require("argon2");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer")
require("dotenv").config();
const Burger = require("./models/Burger")
const User = require("./models/User")


mongoose.connect(process.env.MONGODB_URI);



const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
app.use(cookieParser())


app.get("/", async (req, res) =>{

    const burger = await Burger.find();
    console.log(burger)

    res.render("index", {burger})

})


app.get("/registrer-food", async (req, res) =>{
    console.log(req.cookies)

    const token = req.cookies.jwt;

    const cookie = jwt.verify(token, process.env.SECRET_JWT)
    console.log(cookie)
    let userId = cookie.userId;
    const user = await User.findById(userId)
    console.log(user)
    if(user.role !== "admin"){
        res.redirect("/")
    }else[
        res.render("registrerFood")
    ]

})


app.get("/login", (req, res) =>{
    res.render("login")
})

app.get("/registrer", (req, res) =>{
    res.render("registrer")
})

app.get("/profile", (req, res) =>{
    res.render("profile")
})

app.get("/forgottenPassword", (req, res) =>{
    res.render("forgottenPassword")
})

app.get("/resetPassword", (req, res) =>{
    res.render("resetPassword")
})

app.post("/login", async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        res.status(404).send("Email or password is wrong")
    }

    const correctPassword = await argon2.verify(user.password, password)

    if(!correctPassword){
        res.send("Email or password is wrong")
    }else{
        const token = jwt.sign({userId: user._id}, process.env.SECRET_JWT)
        console.log("token", token)
        res.cookie("jwt", token)

        if(user.role === "admin"){
            res.redirect("registrer-food")
        }else{
            res.redirect("/profile")
        }

    }


})

app.post("/registrer", async (req, res) =>{
    const {email, password, repeatPassword} = req.body;
    if(password !== repeatPassword){
        res.send("Mobgo fuckings db")
    }else{
        const hash = await argon2.hash(password);
        const user = User.insertOne({
            email,
            password: hash
        })

        res.status(201).redirect("/login")
    }
})

app.post("/registrer-food", async (req, res) =>{
    console.log(req.body);
    const {title, description, ingrediens, category, price, imageurl} = req.body;
    const burger = new Burger({title, description, ingrediens, category, price, imageurl})
    await burger.save()
    res.status(200).redirect("/registrer-food")
})



app.post("/forgottenPassword", async (req, res) =>{
    const {email} = req.body;
    const user = await User.findOne({email});
    console.log(user)
    if(user){
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'tamara.jenkins80@ethereal.email',
                pass: 'DaThcu1GkKCf2TXJCV'
            }
        });

        const jwtEmail = jwt.sign({email: user.email}, process.env.SECRET_JWT)

        await transporter.sendMail({
            from: "tamara.jenkins80@ethereal.email",
            to: "tamara.jenkins80@ethereal.email", //Bytte ut med user.email
            subject: "Glemt passord",
            html: `<p>Her er din nye reset passord lenke</p><a href="http://localhost:4000/forgot-password?email=${jwtEmail}">Trykk her</a>`

        })

        res.redirect("/forgottenPassword")
    }
})

app.post("/resetPassword", async (req, res) =>{
    const {password, confirmPassword} = req.body;

    const url = req.query;
    console.log(url)
})




app.listen(process.env.PORT, () =>{
    console.log(`listening on http://localhost:${process.env.PORT}`)
})
