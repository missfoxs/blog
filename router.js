const path = require('path');
const fs = require('fs');
const express = require('express');
let router = express.Router();
const User = require('./models/user');
const Article = require('./models/article');
const util = require('./public/js/util');

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
router.get('/profile', (req, res, next)=>{
    if(!req.session.user){
        return res.redirect('/login')
    }
    // 跳转到个人中心后需要获取当前用户发表过的文章
    //console.log('user articles: ' + req.session.user.articles[0]);
    Article.find({userId: req.session.user._id}, (err, findRes)=>{
        if(err){
            console.log(err);
            return next('find article error')
        }
        console.log("findRes " + findRes);
        req.session.articles = findRes;
        res.render('profile.html', {
            user: req.session.user,
            articles: req.session.articles
        });
    })
})

// 修改个人中心
router.get('/editProfile', (req, res)=>{
    if(!req.session.user){
        return res.redirect('/login')
    }
    res.render('editProfile.html', {
        user: req.session.user
    })
})

router.post('/editProfile', (req, res, next)=>{
    if(!req.session.user){
        console.log(req.session.user.nickname);
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
router.post('/uploadAvatar', (req, res, next) => {
    let fName = req.file.filename;
    let oName = req.file.originalname;
    let fpath = path.join(__dirname, './public/img', fName);
    // 以用户名创建目录
    let targetDir = path.join(__dirname, './public/avator', req.session.user.nickname);
    // 创建头像文件
    let targetPath = path.join(__dirname, './public/avator', req.session.user.nickname, oName);
    fs.readFile(fpath, (err, data)=>{
        if(err){
            console.log(err);
            return next('read file error')
        }
        console.log(data);
        //if()
        // 创建目录
        fs.mkdir(targetDir, {recursive: true}, (err)=>{
            if(err){
                console.log(err);
                console.log('文件已经存在');
                // 清空目录
                util.clearDir(targetDir);
            }
            fs.writeFile(targetPath, data, (err, wirteRes)=>{
                if(err){
                    console.log(err);
                    return next('write file error')
                }
                // 将文件路径存在数据库中
                let queryParame = {email: req.session.user.email};
                console.log(queryParame);
                let avatar = 'public/avator/' + req.session.user.nickname + '/' + oName;
                User.findOneAndUpdate(queryParame, {$set: {avatar}}, {new: true},(err, insertRet)=>{
                    if(err){
                        console.log(err);
                        return next('server error')
                    }
                    console.log(insertRet)
                    req.session.user.avatar = insertRet.avatar;
                    res.redirect('/editProfile')
                })
            })
        })
    })
    //res.send('上传成功');
})

// 创建博客
router.get('/writeBlog',(req, res, next)=>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    res.render('writeBlog.html', {
        user: req.session.user
    })
})

router.post('/writeBlog', (req, res, next)=>{
    req.body.userId = req.session.user._id;
    let article = new Article(req.body);
    // let user = req.session.user;
    // console.log('currentUserId: ' + user._id);
    // article.userId = req.session.user_id;
    console.log(JSON.stringify(article));
    article.save(function(err, saveRes){
        if(err){
            console.log(err);
            return next('create article fail')
        }
        console.log('save Article res: ' +saveRes);
        res.status(200).json({
            code: 0,
            msg: 'save article success!'
        })
    })
})

router.get('/test', (req, res) => {
    res.render('test.html')
})
module.exports = router