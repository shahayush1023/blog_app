const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const salt = bcrypt.genSaltSync(10);
const secret = 'rcgtvrtrevvtrfc45ct4';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieparser());
mongoose.connect('mongodb+srv://ayush:shah2002A@cluster0.zgwiaaw.mongodb.net/?retryWrites=true&w=majority')
app.post('/register',async(req,res)=>{
    const{username,password} = req.body;
    try {
        const userdoc =  await User.create({username,
            password:bcrypt.hashSync(password,salt)});
        res.json(userdoc);
        
    } catch (e) {
        res.status(400).json(e);
    }
});


app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userdoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userdoc.password);
    if (passOk) {
      // logged in
      jwt.sign({username,id:userdoc._id}, secret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id:userdoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('wrong credentials');
    }
  });

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if(err) throw err
        res.json(info);
    });
  });

  app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
  })
app.listen(4000);