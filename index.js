const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {User} = require('./models/User');

const mongoose = require('mongoose');
mongoose.connect('mongodb://suji:{password}@boilerplate-shard-00-00.8guzo.mongodb.net:27017,boilerplate-shard-00-01.8guzo.mongodb.net:27017,boilerplate-shard-00-02.8guzo.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-14ez13-shard-0&authSource=admin&retryWrites=true&w=majority', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    // mongoose 6.0 ver 이상에서 해당 조건 default로 설정.
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/register', (req, res) => {
    // 회원 가입에 필요한 정보들을 client에서 가져오면 DB에 넣어준다.

    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    });

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})