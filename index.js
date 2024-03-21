const express = require("express")
const bcrypt = require("bcrypt")
const session = require("express-session")
const cookieParser = require('cookie-parser')
const mysql = require("mysql")
const myConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "loginsystem"
})
// test the db connection
myConnection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("datbase connected succefully");
    }
})
// myConnection.query("DROP TABLE users")
myConnection.query("CREATE TABLE if not EXISTS users(userid INT NOT NULL AUTO_INCREMENT, email VARCHAR(100), fullname VARCHAR(100), password VARCHAR(255), phone VARCHAR(20),dob DATE, PRIMARY KEY(userid))", (sqlerror, QRES)=>{
    if(sqlerror){
        console.log(sqlerror.message);
    }else{
        console.log("table created");
        // console.log(QRES);
    }
})

const app = express()
// use method is used to run middleware functions - these are functions that run in every request
app.use((req,res,next)=>{
    let adminRoutes = ["/dash", "/res"]
    console.log(req.path);
    console.log("This is a middleware function!!!!!runs on every request");
    next()
})
// middleware can be used for authentication i.e. make sure that requests being recieved are from logged in users, since http is stateles
// Http is stateless implies that every request-response cycle is completely independant,even if they are from the same device
app.use(express.urlencoded({extended: false})) // body parser -- converts the body of the incoming request into a javascript object
app.use(express.static("assets")) // tell express to look for static files(css, )
app.use(session({
    secret: "jfdjfd",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000}
}))
app.use(cookieParser())
app.use((req,res,next)=>{
    const protectedRoutes = ["/protectedRouteOne","/protectedRouteTwo","/profile",]
    const adminRoutes = ["/profile"]
    const adminEmail = "admin@eldohub.co.ke"
    if(req.session && req.session.user ){
        res.locals.user = req.session.user
        if(adminRoutes.includes(req.path) && req.session.user.role === "admin") {

        }else{

        }
        next()
    }else if(protectedRoutes.includes(req.path)){
        res.status(201).send("Login to acess this resource")
    }else {
        // public route -- , signup, landing, login
        next()
    }
   
})
// app.post("/colletcookie")
app.get("/", (req, res)=>{
    console.log(req.baseUrl);
    console.log(req.cookies);
    res.render("index.ejs")
})
app.get("/sample", (req, res)=>{
    console.log(req.baseUrl);
    res.render("sample.ejs")
})
app.get("/login", (req,res)=>{   
    if(req.query.signupSuccess){
        res.render("login.ejs", {message: "Signup successful!! You can now log in."})
    }else{
        res.render("login.ejs")
    }
})

app.post("/login", (req,res)=>{
 // RECIEVE DATA
    // COMPARE CRED WITH WHAT IS DB
    // IF PASS/MATCH -- CREATE A SESSION
    // wHAT ARE SESSIONS AND WHY WE NEED SESSIONS IN A WEB SERVER
    // WHAT DOES IT MEAN TO SAY HTTP IS STATELESS
    console.log(req.body);
    const loginStatement = `SELECT email,fullname, password FROM users WHERE email = '${req.body.email}'`
    myConnection.query(loginStatement, (sqlErr, userData)=>{
        if(sqlErr){
            console.log(sqlErr.message);
            res.status(500).render("login.ejs", {message: "Server Error, Contact Admin if this persists!" })
        }else{
            console.log(userData);
            if(userData.length == 0){
                res.status(401).render("login.ejs", {message: "Email or Password Invalid 1" })
            }else{
                if( bcrypt.compareSync(req.body.pass,userData[0].password ) ){
                    // create a session
                    // res.cookie("email",userData[0].email, {maxAge: 60} )
                    req.session.user = userData[0]
                    res.redirect("/")
                }else{
                    res.status(401).render("login.ejs", {message: "Email or Password Invalid 2" })
                }
            }
        }
    })
})

app.get("/signup", (req,res)=>{
      res.render("signup.ejs")
})
app.post("/signup", (req,res)=>{
      // RECIEVE DATA form clinet/frontend
    // INPUT VALIDATION -- compare password with confirm password, email validation, -- sql injection
    // HASH THE PASSWORD -- 
    // SAVE DATA IN DB
    console.log(req.body)
    if(req.body.pass === req.body.confirm_pass){
        // proceed
        //encryption methods/algotithms --
        let sqlStatement = `INSERT INTO users(email,fullname,password,phone,dob) VALUES( "${req.body.email}", "${req.body.fname}", "${bcrypt.hashSync(req.body.pass, 5)}", "${req.body.phone}", "${req.body.dob}") `
        myConnection.query(sqlStatement, (sqlErr)=>{
            if(sqlErr){
                // res.status(500).send("Database Error")
                res.status(500).render("signup.ejs", {error: true, errMessage: "Server Error: Contact Admin if this persists.", prevInput: req.body  } )
            }else{
                res.status(304).redirect("/login?signupSuccess=true")
            }
        })        
    }else{
        res.render("signup.ejs", {error: true, errMessage: "password and confirm password do not match!", prevInput: req.body  } )
    }
})
app.get("/protectedRouteOne", (req,res)=>{
    res.send("Only for logged in users!")
})
app.get("/protectedRouteTwo", (req,res)=>{
    res.send("Only for logged in users!")
})
app.get("/publicRouteOne", (req,res)=>{
    res.send("for any visitors!!")
})
app.get("*", (req,res)=>{
    res.status(404).send("Page Not Found")
})
// start/run
app.listen(5000, ()=>console.log("Server running on port 5000"))
