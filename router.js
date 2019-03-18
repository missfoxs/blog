const express = require('express');
let router = express.Router();

router.get('/', (req,res)=>{
    res.render('index.html');
})
// 登录
router.get('/login', (req,res)=>{
    res.render('login.html');
})
router.post('/login', (req,res)=>{
    // res.render('index.html');
})
// 注册
router.get('/register', (req,res)=>{
    res.render('register.html');
})
router.post('/register', (req,res)=>{
    console.log(req.body);
})

module.exports = router