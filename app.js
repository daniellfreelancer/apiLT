require('dotenv').config()
require('./config/database')


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors')
const usersApp = require('./routes/userAppRoutes')
const fs = require('fs')
const multer = require('multer')
const uploadMiddleware = multer({dest: 'uploads/'})

const Post = require('./models/Post')
const jwt = require('jsonwebtoken')
const secret = 'asdnonasdlmaofpasmdplmpkmaousbdpin284613216847'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(cors({credentials:true,origin:'https://exuberant-pink-angelfish.cyclic.app'}));
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/post', uploadMiddleware.single('file') , async (req, res)=>{

  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);


  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async  (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author: info.id
    });
    res.json(postDoc);

  });
})

app.get('/post', async (req, res)=>{
  res.json(await Post.find().populate('author', {username: 1}).sort({createdAt: -1}))
})

app.get('/post/:id', async (req, res)=>{
  const {id} = req.params;
  const postById = await Post.findById(id).populate('author', {username: 1})
  if (postById){
    res.status(200).json(postById)
  }
})


app.put('/post', uploadMiddleware.single('file'), async (req, res)=>{
  let newPath = null;
  if (req.file){
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async  (err,info) => {
    if (err) throw err;

    const {id, title, summary, content} = req.body;

    const postDoc = await Post.findById(id)

    
    const isAuthor = JSON.stringify(postDoc.author)  === JSON.stringify(info.id) 

    // res.json({isAuthor})

    if (!isAuthor){
      res.status(400).json({
        message: "No puedes editar este post",
        success: false
      })
    }

    await postDoc.updateOne({
      title, 
      summary, 
      content, 
      cover: newPath ? newPath : postDoc.cover
    });


    res.json(postDoc)

    // if(info.id === )
    // const {title,summary,content} = req.body;
    // const postDoc = await Post.create({
    //   title,
    //   summary,
    //   content,
    //   cover:newPath,
    //   author: info.id
    // });
    // res.json(postDoc);

  });


})




//my Routes
app.use('/blog', usersApp);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
