const express = require('express');
const path = require('path');

let app = express();

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 配置引擎模板,不是只有art-template， 其余还有ejs,jade(pug),nunjucks
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/'));

app.get('/', (req,res)=>{
    res.render('index.html', {
        name: 'zs'
    });
})
app.listen(5000);