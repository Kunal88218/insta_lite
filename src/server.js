const Express = require('express')
const app = Express()
const prisma = require("./db");
require("dotenv").config();


app.get('/health',(req,res)=>{
    res.json({ "status": "OK" })
})


app.use(Express.json())


app.listen(3000,()=>{
    console.log("Server listening on 3000")
})