module.exports = function(io) {

    var mongoose = require('mongoose');
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var jwt = require('express-jwt');
	var path = require('path');
    var User = mongoose.model('User');
    var socket;
	var chat_username;
var assert = require('assert');
var parser = require('mongo-parse');
var MongoClient = require('mongodb').MongoClient;
var r = [];
var x = [];
var y = [];
var h;
var url = 'mongodb://localhost:27017/savtrack';
    var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
    
    io.on('connection', function(skt) { 
       "use strict";
       console.log("connected to server");
       socket = skt;
    });

    function sendAll(result, currSongSrc){
      "use strict";
      socket.broadcast.emit("currentPausePlay", {"result" : result, "currSongSrc" : currSongSrc});
    }

    router.post('/room/pp', function(req, res, next){
       //console.log(req);
       var result = req.body.currentPausePlay;
	   var currSongSrc = req.body.currSongSrc;
	   console.log(result)
	   console.log(currSongSrc);
       sendAll(result, currSongSrc);
       res.json(result);
    });
var trial=[];
io.on('connection',function(socket){
  socket.on('chat message', function(msg){
	  console.log("usermessage"+msg.username);
	  io.emit('chat message',{"message":msg.message,"username":msg.username});
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        updateChats(db, function() {
            
        });
    });
    var updateChats = function(db, callback) {
        db.collection('chats').insert({
			"msg":msg.message, "username":msg.username,"roomnumber":h
        }, function(err, results) {
            callback();
        });
    };
    console.log('message: ' + trial);
  });
});

//io.emit('some event', { for: 'everyone' });
router.get('/chats', function(req, res) {
	console.log("hi der!!!");
	var room = h;
	console.log("roomnumber"+room);
	
	MongoClient.connect(url, function(err, db) {
        savChat(db, function() {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(r);
            r = [];
			
        });
    });

    var savChat = function(db, callback) {
        var cursor = db.collection('chats').find(
		{"roomnumber":room});
        cursor.each(function(err, doc) {
            if (doc !== null) {
                r.push(doc);
            } else {
                callback();
            }
        });
    };
});
function changedTime(currTime, currSongSrc, result){
     "use strict";
      socket.broadcast.emit("currentPausePlay", {"currTime" : currTime, "currSongSrc" : currSongSrc, "result": result}); 
    }

    router.post('/room/sktEvent', function(req, res, next){
       console.log(req.body);
       var currTime = req.body.currTime;
       var currSongSrc = req.body.currSongSrc;
       var result = req.body.currentPausePlay;

       changedTime(currTime, currSongSrc, result);
       res.json(currTime);
    });

    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('savTrack');
    });


    router.get('/index.html', function(req, res, next) {
      res.render('index');
    });

router.get('/savTrack.html', function(req, res, next) {
      res.render('savTrack');
    });
    router.get('/home.html', function(req, res, next) {
      res.render('home');
    });


    router.get('/login.html', function(req, res, next) {
      res.render('login');
    });

	
	router.get('/room/:id', function(req, res) {
    
	var id1 = req.params.id;
	console.log("roomnumber"+id1);
	h=id1;
	console.log("hhhhhhh"+h)
	res.sendfile(path.join(__dirname, '../views', 'home.html'));

});	
	
	router.get('/posts', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        redditPost(db, function() {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(r);
            r = [];
        });
    });

    var redditPost = function(db, callback) {
        var cursor = db.collection('posts').find();
        cursor.each(function(err, doc) {
            if (doc !== null) {
                r.push(doc);
            } else {
                callback();
            }
        });
    };
	
});
	


    // register users
    router.post('/register', function(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
	  chat_username = req.body.username;
console.log("myusernameregister"+chat_username);

      //checking for similar username
      User.findOne({ username: req.body.username }, function (err, user) {
          if (err) { return done(err); }

          if (!user) {

            var user = new User();
            user.username = req.body.username;
            user.setPassword(req.body.password)

            user.save(function (err){
              if(err){ return next(err); }
              return res.json({token: user.generateJWT()})
            });
          }else{
            return res.json({message: 'User already present'});
          }
      }); 

    });


    // login for user
    router.post('/login', function(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
	  chat_username = req.body.username;
console.log("myusernamelogin"+chat_username);
      passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
          return res.json({token: user.generateJWT()});
        } else {
          return res.json({message: 'No such user present'});
        }
      })(req, res, next);

    });

  return router;
}




