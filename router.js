const express = require('express');
let router = express.Router();
const User = require('./models/user');

// 加密密码模块
// const crypto = require('crypto');
// const hash = crypto.createHash('md5');
const md5 = require('md5');

router.get('/', (req,res)=>{
    res.render('index.html',{
        user: req.session.user
    });
})
// 登录
router.get('/login', (req,res)=>{
    res.render('login.html');
})

router.post('/login', (req,res, next)=>{
    let body = req.body;
    let password = md5(md5(body.password));
    User.findOne({email: body.email, password: password}, function(err, user){
        if(err){
            return next('serve error');
        }
        if(!user){
            return res.status(200).json({
                code: 1,
                msg: 'email or password is invalid'
            })
        }

        // 用户存在，登录成功，记录登录状态
        req.session.user = user;
        return res.status(200).json({code: 0, mag: 'login success'})
    })
})

// 注册
router.get('/register', (req,res)=>{
    res.render('register.html');
})

router.post('/register', (req,res,next)=>{
    let body = req.body;
    // 使用 或 语句查询邮箱或者用户名是否已被注册
    User.findOne({
        $or: [
            {email: body.email},
            {nickname: body.nickname}
        ]
    }, function(err, data){
        if(err){
            //return res.status(500).send(JSON.stringify({code: 500, msg: 'server error'}))
            return next('server error')
        }
        if(data){
            return res.status(200).send(JSON.stringify({code: 1, msg: '用户名或邮箱已被注册'}))
        }

        let user = new User(body);
        user.password = md5(md5(user.password));
        user.save(function(err, user){
            if(err){
                return next('server error')
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

// 退出登录
router.get('/logout', (req,res)=>{
    // 清除登录状态
    req.session.user = null;
    // a标签是同步请求，可以直接在服务器端重定向
    res.redirect('/');
})


// 个人中心
router.get('/profile', (req, res)=>{
    res.render('profile.html', {
        user: req.session.user
    });
})

// 修改个人中心
router.get('/editProfile', (req, res)=>{
    res.render('editProfile.html', {
        user: req.session.user
    })
})

router.post('/editProfile', (req, res, next)=>{
    if(!req.session.user){
        // return res.status(200).json({
        //     code: 1,
        //     msg: 'need login'
        // })
        res.redirect('/login')
    }
    let queryParame = {email: req.body.email};
    let body = req.body;
    User.findOneAndUpdate(queryParame,{$set: {email: body.email, nickname: body.nickname}}, {new: true}, (err, resUser)=>{
        if(err){
            return next('server error1')
        }
        req.session.user = resUser;
        res.status(200).json({
            code: 0,
            msg: 'modify profile success!'
        })
    })
})
// 上传头像
router.post('/uploadAvatar', (req, res) => {
    console.log("file: " + JSON.stringify(req.file));
    console.log('body: ' + JSON.stringify(req.body));
    res.send('上传成功');
})
module.exports = router