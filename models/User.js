const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // delete space
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

// db에 save 하기 전에 하는 행동 정의
// 비밀번호 암호화
userSchema.pre('save', function (next) {
    let user = this;

    // 비밀번호를 변경할 때만 실행
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt){
            if (err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })

    } else {
        next();
    }

})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword를 암호화한 후 db에 있는 비밀번호와 맞는지 확인
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    let user = this;
    // jsonwebtoken 이용해서 token 생성
    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user) {
        if (err) return cb(err);
        cb(null, user);
    })

}

const User = mongoose.model('User', userSchema);

module.exports = { User };