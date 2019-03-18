const express = require('express');
const path = require('path');
const router = require('./router');
let app = express();
const bodyParser = require('body-parser');
// parser application/x-www-form-urlencode
app.use(bodyParser.urlencoded({extended: false}))
// parser application/json
app.use(bodyParser.json())
app.use(router);

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 配置引擎模板,不是只有art-template， 其余还有ejs,jade(pug),nunjucks
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views/'));

app.listen(5000);