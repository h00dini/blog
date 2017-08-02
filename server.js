var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogCora');

var PostSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: String,
  tag: {type: String, enum: ['Birth', 'Pics']},
  posted: {type: Date, default: Date.now}
}, {collection: 'post'});

var PostModel = mongoose.model("PostModel", PostSchema);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post("/api/blogpost", createPost);
app.get("/api/blogpost", getAllPosts);
app.delete("/api/blogpost/:id", deletePost);
app.get("/api/blogpost/:id", getPostByID);
app.put("/api/blogpost/:id", updatePost);

function updatePost(req, res) {
  var PostID = req.params.id;
  var post = req.body;
  PostModel
    .update({_id: PostID}, {
      title: post.title,
      body: post.body
    })
    .then(
      function(status) {
        res.sendStatus(200);
      },
      function(err) {
        res.sendStatus(400);
      }
    );
}

function getPostByID(req, res) {
  var postID = req.params.id;
  PostModel
    .findById(postID)
    .then(
      function (post) {
        res.json(post);
      },
      function (err) {
        res.sendStatus(400);
      }
    );
}

function deletePost(req, res) {
  var postID = req.params.id;
  PostModel
    .remove({_id: postID})
    .then(
      function (status) {
        res.sendStatus(200);
      },
      function (status) {
        res.sendStatus(400);
      }
    );
}

function getAllPosts(req, res) {
  PostModel
    .find()
    .then(
      function (posts) {
        res.json(posts);
      },
      function (err) {
        res.sendStatus(400);
      }
    );
}

function createPost(req,res) {
  var post = req.body;
  console.log(post);
  PostModel
    .create(post)
    .then(
      function (postObj) {
        res.json(200);
      },
      function (error) {
        res.sendStatus(400);
      }
    );
}

app.listen(8080);
