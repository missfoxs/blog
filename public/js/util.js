const fs = require('fs');
let clearDir = function(tpath){
    let files = [];
    if(fs.existsSync(tpath)){
        files = fs.readdirSync(tpath);
        files.forEach(function(file, index){
            let curpath = tpath + '/' + file;
            if(fs.statSync(curpath).isDirectory()){
                deleteDir(curpath);
            }else{
                fs.unlinkSync(curpath);
            }
        })
    }
}

module.exports = {
    // 清空文件夹
    clearDir
};