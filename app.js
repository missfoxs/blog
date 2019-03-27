const express = require('express');
const path = require('path');
const router = require('./router');
const session = require('express-session');
const multer = require('multer');

let app = express();
const bodyParser = require('body-parser');
// parser application/x-www-form-urlencode
app.use(bodyParser.urlencoded({extended: false}));
// parser application/json
app.use(bodyParser.json());

// 使用express-session中间件
app.use(session({
    // 配置加密字符串，会在原有加密基础上和这个字符串拼起来加密,以增加安全性
    secret: 'wangzm',
    resave: false,
    // 如果为true,无论是否使用session，都默认给客户端发送一个session-id
    saveUninitialized: true
}))

// 处理图片
app.use(multer({ dest: './public/img'}).single('image'));

//app.use(db);
app.use(router);

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 配置引擎模板,不是只有art-template， 其余还有ejs,jade(pug),nunjucks
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/'));

// 配置出404中间件
app.use((req,res,next)=>{
    res.send('404')
})

// 统一服务器错误返回的中间件
// 四个参数必须写全
app.use((err, req, res, next)=>{
    res.status(500).json({
        code: 500,
        msg: err
    })
})

app.listen(5000, function(){
    console.log('server running at port 5000')
});