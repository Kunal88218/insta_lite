const usersService = require("../services/users.service");
const prisma = require("../db");

async function create(req, res) {
  const {username,email,fullname,bio} = req.body
     if (!username || !email || !fullname) {
       return res.status(400).json({
         error: "username, email and fullname are required",
       });
     }
    try{
      const user = await prisma.user.create({
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


async function list(req, res) {
  try {
   const users = await prisma.user.findMany();
   res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getOne(req, res) {
  const id = Number(req.params.id)
  try{
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  if (user){
    res.json(user)
  }
  else{
    res.status(404).json({ error: "User not found" });
  }} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  const { fullname, bio } = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: { id: id },
      data: {
        fullname,
        bio,
      },
    });
    res.json(updateUser);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
}

module.exports = { create, list, getOne, update, remove };
