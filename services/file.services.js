const fs = require('fs')
const path = require('path')
module.exports.DeleteProfileImageFile=(imageFileNameList)=>{
    imageFileNameList.forEach(fn => {
        const oldImagePath = path.join(path.resolve(__dirname,'..'), '/uploads/profile/', fn) ;
        fs.unlinkSync(oldImagePath);
        console.log("deleted old image");
    });
}
module.exports.DeleteImageFile=(imageFileNameList)=>{
    imageFileNameList.forEach(fn => {
        const oldImagePath = path.join(path.resolve(__dirname,'..'), '/uploads/images/', fn) ;
        fs.unlinkSync(oldImagePath);
        console.log("deleted old image");
    });
}

module.exports.DeleteVideoFile =(videoFileNameList)=>{
    videoFileNameList.forEach(fn => {
        const oldVideoPath = path.join(path.resolve(__dirname,'..'), '/uploads/videos/', fn) ;
        fs.unlinkSync(oldVideoPath);
        console.log("deleted old video");
    });
}