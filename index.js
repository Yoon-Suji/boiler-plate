const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb://suji:{password}@boilerplate-shard-00-00.8guzo.mongodb.net:27017,boilerplate-shard-00-01.8guzo.mongodb.net:27017,boilerplate-shard-00-02.8guzo.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-14ez13-shard-0&authSource=admin&retryWrites=true&w=majority', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    // mongoose 6.0 ver 이상에서 해당 조건 default로 설정.
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})