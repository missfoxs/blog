const express = require('express');
let router = express.Router();
const User = require('./models/user');

// 加密密码模块
const crypto = require('crypto');
const hash = crypto.createHash('md5');

router.get('/', (req,res)=>{
    console.log("/ " + JSON.stringify(req.session.user));
    res.render('index.html',{
        user: req.session.user
    });
})
// 登录
router.get('/login', (req,res)=>{
    res.render('login.html');
})

router.post('/login', (req,res)=>{
    console.log(req.body);
    let body = req.body;
    hash.update(body.password);
    body.password = hash.digest('hex');
    console.log('login: password' + body.password);
    User.findOne({email: body.email, password: body.password}, function(err, res){
        if(err){
            return res.status(500).json({code: 500, msg: 'server error'})
        }
        if(res){
            return res.status(200).json({code: 0, mag: 'login success'})
        }
    })
})

// 注册
router.get('/register', (req,res)=>{
    res.render('register.html');
})

router.post('/register', (req,res)=>{
    let body = req.body;
    console.log(body);
    // 使用 或 语句查询邮箱或者用户名是否已被注册
    User.findOne({
        $or: [
            {email: body.email},
            {nickname: body.nickname}
        ]
    }, function(err, data){
        if(err){
            return res.status(500).send(JSON.stringify({code: 500, msg: 'server error'}))
        }
        if(data){
            return res.status(200).send(JSON.stringify({code: 1, msg: '用户名或邮箱已被注册'}))
        }

        let user = new User(body);
        // hash.update(user.password);
        // user.password = hash.digest('hex');
        // console.log('register.password: ' + user.password);
        user.save(function(err, user){
            if(err){
                return res.status(500).send(JSON.stringify({code: 500, msg: 'server error'}))
            }
            // 使用session存储当前用户
            req.session.user = user;
            
            // res.status(200).send(JSON.stringify({code: 0, msg: '注册成功'}));
            // 使用express提供的响应方法json代替，会自动将对象转为字符串
            res.status(200).json({code: 0, msg: '注册成功'})
            // 服务端重定向只对同步请求有效，异步无效
            // res.redirect('/')
        })
    })
})

module.exports = router