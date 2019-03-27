const mongoose = require('../db');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_time: {
        type: Date,
        // 不能写成Date.now()
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        // -1  保密
        enum: [-1,0,1],
        default: -1
    },
    birthday: {
        type: Date
    },
    status: {
        type: Number,
        // 0-没有权限限制
        // 1-不可以评论
        // 2-不可登录
        // 是否可以评论
        enum: [0,1,2],
        default: 0
    },
    articles: {
        type: Array
    }
})

module.exports = mongoose.model('User', userSchema)