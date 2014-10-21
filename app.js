var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
    db = require("./models/index");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', function(req, res){
  res.render('home');
});

///////////////// AUTHOR ROUTES  ///////////////////
//Index
app.get('/authors', function(req,res) { 
  db.Author.findAll().done(function(err,author) {
    res.render('author/index', {allAuthors: author});
  });
});

//New
app.get('/authors/new', function(req,res) { 
  res.render('author/new');
});

//Create
app.post('/authors', function(req,res) { 
  db.Author.create({
    name: req.body.author.name,
    age: req.body.author.age
  }).done(function(err){
    res.redirect('/authors');
  });
});

//Show
app.get('/authors/:id/posts', function(req,res) { 
  db.Author.find(req.params.id).done(function(err,author){
    author.getPosts().done(function(err,posts){
      res.render('author/show',{allPosts: posts, author:author});
    });
  });
});

//Edit
app.get('/authors/:id/edit', function(req,res) { 
  db.Author.find(req.params.id).done(function(err,author){
    res.render('author/edit', {author: author});
  });
});

//Update
app.put('/authors/:id', function(req,res){
  db.Author.find(req.params.id).done(function(err,author){
    author.updateAttributes({
      name: req.body.author.name,
      age: req.body.author.age,
  }).done(function(err){
    res.redirect('/authors');
    });
  });
});

//Delete
app.delete('/authors/:id',function (req,res){
  db.Author.find(req.params.id).done(function(err,author){
    db.Post.destroy({
      where: {
        AuthorId: author.id
      }
    }).done(function(err){
      author.destroy().done(function(err){
        res.redirect('/authors');
      });
    });
  });
});



/////// Post Routes /////////

//Index
app.get('/posts', function(req,res) {
  db.Post.findAll().done(function(err,posts){
    res.render('posts/index',{allPosts: posts});
  }) ;
});

//New
app.get('/posts/:id/new', function(req, res){
  var id = req.params.id;
  res.render('posts/new',{id:id ,title:"",body:""});
});

//Create
app.post('/posts/:id', function(req, res){
  var AuthorId = req.params.id;
  var title = req.body.post.title;
  var body = req.body.post.body;

  db.Post.create({
    title: title,
    body: body,
    AuthorId: AuthorId
  }).done(function(err,post){
    console.log("This is post:" + post);
    res.redirect('/authors/'+AuthorId+'/posts');
  });
});

//Show
app.get('/posts/:id', function(req,res) { 
  db.Post.find(req.params.id).done(function(err,post){
    res.render('posts/show', {post: post});
  });
});

//Edit
app.get('/posts/:id/edit', function(req,res) { 
  db.Post.find(req.params.id).done(function(err,post){
    res.render('posts/edit',{post: post});
  });
});

//Update
app.put('/posts/:id',function(req,res){
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    post.getAuthor().done(function(err,author){
      post.updateAttributes({
        title: req.body.post.title,
        body: req.body.post.body
      }).done(function(err){
        res.redirect('/authors/'+author.id+'/posts');
      });
    });
  });
});

//Delete
app.delete('/posts/:id', function(req,res){
  db.Post.find(req.params.id).done(function(err,post){
    post.getAuthor().done(function(err,author){
      post.destroy().done(function(err){
        res.redirect('/authors/' +author.id+'/posts');
      });
    });
  });
});



//Static Information
app.get('/about', function(req,res) { //My about page
  res.render('about');
});

app.get('/contact', function(req, res) { // My contact page
  res.render('contact');
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});