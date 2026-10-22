const Express = require('express')
const app = Express()
require("dotenv").config();


app.get('/health',(req,res)=>{
    res.json({ "status": "OK" })
})
const { PrismaClient }= require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");


app.use(Express.json())
app.post('/users',async(req,res)=>{
    const {username,email,fullname,bio} = req.body
     if (!username || !email || !fullname) {
       return res.status(400).json({
         error: "username, email and fullname are required",
       });
     }
    try{
      const user = await prisma.User.create({
        data: {
          email,
          username,
          fullname,
          bio
        },
      });
      res.status(201).json(user)
    }
    catch(err){
      res.status(409).json({ "error": "username or email already taken" })
    }
  }
)


app.get('/users',async(req,res)=>{
    const users = await prisma.user.findMany();
    res.json(users)
})

app.get('/users/:id',async(req,res)=>{
  id = Number(req.params.id)
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  if (user){
    res.json(user)
  }
  else{
    res.status(404).json({ error: "User not found" });
  }
})


app.patch('/users/:id',async(req,res)=>{
  const id = Number(req.params.id)
  const {fullname,bio} = req.body
  try{
  const updateUser = await prisma.user.update({
    where: { id : id },
    data: {
      fullname,
      bio
    },
  });
  res.json(updateUser)}
  catch(err){
    res.status(404).json({ error: "User not found" });
  }
})

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});


const prisma = new PrismaClient({ adapter });




app.listen(3000,()=>{
    console.log("Server listening on 3000")
})