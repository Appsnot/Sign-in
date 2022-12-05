const express = require('express');
const path = require('path');
const api = express();
const hbs = require('hbs');
const app = require('./app');
require("./src/db/conn");
const Register = require("./src/models/registers");
const templates = require("./src/templates/views");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"./public");
const template_path = path.join(__dirname,"./src/templates/views");
const partials_path = path.join(__dirname,"./src/templates/partials");
//postman
api.use(express.json());
api.use(express.urlencoded({extended:false}));

//this can be used for html files
api.use(express.static(static_path))
// this can be used for hbs files (which renders hbs files)
api.set("view engine", "hbs");
api.set("views",template_path);
hbs.registerPartials(partials_path);


api.get('/',(req,res)=>{
    res.render("index")
});
api.get("/register",(req,res)=>{
    res.render("register");
});
// to create user database
api.post("/register",async(req,res)=>{
    try {
       const password= req.body.password;
       const rpassword = req.body.repeatpassword;
       if(password === rpassword){
           const registerBookings = new Register({
                
                    name : req.body.name,
                    email : req.body.email,
                    password :req.body.password,
                    repeatpassword :req.body.repeatpassword,

                
           })
           // to save in database
        const registered =  await registerBookings.save();
        res.status(514).render("index");
       }else{
           res.send("passwords are not matching");
       }

        
    } catch (error) {
        res.status(555).send(error);
    }
});
api.get("/login",(req,res)=>{
    res.render("login");
});
//login check
api.post("/login",async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.psw;

       const userEmail= await  Register.findOne({email : email});

        if(userEmail.password === password)
        {
            res.status(514).render("index");
        }else{
           res.send("invalid login details");

        }
        
    } catch (error) {
        res.status(555).send("invalid email or password");
        
    }
});
api.listen(port,()=>{
    console.log(`server is running at port number ${port}`);
})
