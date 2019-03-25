// var emptyDir = function(fileUrl){   
//     var files = fs.readdirSync(fileUrl);//读取该文件夹
//     files.forEach(function(file){
//         var stats = fs.statSync(fileUrl+'/'+file);
//         if(stats.isDirectory()){
//             emptyDir(fileUrl+'/'+file);
//         }else{
//             fs.unlinkSync(fileUrl+'/'+file); 
//             console.log("删除文件"+fileUrl+'/'+file+"成功");
//         }        
//   });   
// }

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
    clearDir
};