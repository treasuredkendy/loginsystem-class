const express = require("express")
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
        console.log(err.message);
    }else{
        console.log("datbase connected succefully");
    }
})
myConnection.query("CREATE TABLE if not EXISTS users(userid INT NOT NULL AUTO_INCREMENT, email VARCHAR(100), fullname VARCHAR(100), password VARCHAR(255), phone VARCHAR(20), PRIMARY KEY(userid))", (sqlerror, QRES)=>{
    if(sqlerror){
        console.log(sqlerror.message);
    }else{
        console.log("table created");
        // console.log(QRES);
    }
})

const app = express()
app.get("/", (req, res)=>{
    console.log(req.baseUrl);
    res.render("index.ejs")
})
app.get("/login", (req,res)=>{
    // RECIEVE DATA
    // COMPARE CRED WITH WHAT IS DB
    // IF PASS/MATCH -- CREATE A SESSION
    // wHAT ARE SESSIONS AND WHY WE NEED SESSIONS IN A WEB SERVER
    // WHAT DOES IT MEAN TO SAY HTTP IS STATELESS
    // UUID()
    //PARAMS

    res.render("login.ejs")
})
app.get("/signup", (req,res)=>{
    // RECIEVE DATA form clinet/frontend
    // INPUT VALIDATION
    // HASH THE PASSWORD
    // SAVE DATA IN DB
    console.log(req.path);
    console.log(req.query);
    console.log(req.PARAMS);
    res.render("signup.ejs")
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
