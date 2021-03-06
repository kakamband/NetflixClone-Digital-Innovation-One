const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const methodOverride = require('method-override');

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/js/owl'))

app.use(express.static(__dirname + '/public/img'));

app.use(express.static("style"));
app.use(express.static(__dirname + '/style'));

app.use(express.static(__dirname + '/style/owl'));

mongoose.connect("mongodb+srv://admin-app:123456app@movieapi.z0kfu.mongodb.net/movietrailer", 
{  useNewUrlParser: true,
  useUnifiedTopology: true});

const postSchema = {
  title: String,
  watch: String,
  rating: Number,
  coverBox: String,
  mainActor: String,
  actorPhoto: String,
  launchYear: String,
  youtubeTrailer: String,
  sinopse: String,
  gender: String,
  kind: String,
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  
  Post.find({}, function(err, posts, movieposts){
    res.render("home", {
      posts: posts,
    });
  })
})

app.get("/postcontent", function(req, res){
  res.render("postcontent");
})

app.get('/postMovie', function(req, res){
  res.render("movieContent");
})

app.post("/postcontent", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    watch: req.body.postWatch,
    kind: req.body.postKind,
    gender: req.body.postGender,
    rating: req.body.imdbRating,
    coverBox: req.body.coverBox,
    mainActor: req.body.mainActor,
    actorPhoto: req.body.postActorPhoto,
    launchYear: req.body.launchYear,
    youtubeTrailer: req.body.youtubeTrailer,
    sinopse: req.body.postSinopse
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  })
})

app.get("/postcontent", function(req, res){
  Post.find(function(err, foundItems){
    if(!err){
      res.send(foundItems);
    }
    else{
      res.send(err);
    }
  })
})

app.get("/postcontent/:id", function(req, res){
  const requestedPostId = req.params.id;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("tvShowContent", {
      title: post.title,
      watch: post.watch,
      kind: post.kind,
      gender: post.gender,
      rating: post.rating,
      coverBox: post.coverBox,
      mainActor: post.mainActor,
      actorPhoto: post.actorPhoto,
      launchYear: post.launchYear,
      youtubeTrailer: post.youtubeTrailer,
      sinopse: post.sinopse
    })
  })

});

app.get("/postcontent/:title/edit", function(req, res){
  //const requestedPostId = req.params.id;
  const requestedPostedTitle = req.params.title;
  
  console.log(requestedPostedTitle);

  Post.findOne({title: requestedPostedTitle}, function(err, post){
    res.render("editContent", {
      title: post.title,
      watch: post.watch,
      kind: post.kind,
      gender: post.gender,
      rating: post.rating,
      coverBox: post.coverBox,
      mainActor: post.mainActor,
      actorPhoto: post.actorPhoto,
      launchYear: post.launchYear,
      youtubeTrailer: post.youtubeTrailer,
      sinopse: post.sinopse
    });
  });
});

app.put("/postcontent", function(req, res){
  console.log("Atualizado");
})

app.put("/postcontent/:title", function(req, res){

  Post.update(
    {title: req.params.title},
    {
      title: req.body.postTitle,
      watch: req.body.postWatch,
      kind: req.body.postKind,
      gender: req.body.postGender,
      rating: req.body.imdbRating,
      coverBox: req.body.coverBox,
      mainActor: req.body.mainActor,
      actorPhoto: req.body.postActorPhoto,
      launchYear: req.body.launchYear,
      youtubeTrailer: req.body.youtubeTrailer,
      sinopse: req.body.postSinopse
    },
      {overwrite: true},
      function(err){
        if(!err){
          res.redirect("/");
        }
        else{
          console.log(err);
        }
      }
      );
});

app.delete("/postcontent/:title", function(req, res){

  Post.deleteOne(
    {title: req.params.title},
    function(err){
      if(!err){
        res.redirect("/");
      }
      else{
        res.send(err);
      }
    }
    )

})

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function(){
  console.log("Server has started successfully.")
})