const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const {User} = require('./config/models/User');
const config = require('./config/key');
const {auth} = require('./config/middleware/auth');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    // mongoose 6.0 ver 이상에서 해당 조건 default로 설정.
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/api/hello', (req, res) => res.send('Hello World'))

app.post('/api/users/register', (req, res) => {

    // 회원 가입에 필요한 정보들을 client에서 가져오면 DB에 넣어준다.

    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    });

});

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일이 데이터베이스에 있는지 확인
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch){
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
            }
        })
    
        // Token 생성
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            // token 저장 -> 쿠키, local storage, session ..
            res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id})
        })
    })

});

// auth == middleware
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, 
        {token: ""}, (err, user) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});