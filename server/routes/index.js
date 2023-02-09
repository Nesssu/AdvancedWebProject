const express = require('express');
const router = express.Router();
const Posts = require('../models/Post');
const Comments = require('../models/Comment');
const Users = require('../models/User');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) =>
{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).send("Unauthorized");

  jwt.verify(token, 'secrets', (err, user) =>
  {
    if (err) return res.status(401).json({message: "unauthorized"});

    req.user = user;
    next();
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/api/code/add", authenticateToken, (req, res) =>
{
  const code = req.body.code;
  const votes = 0;
  const commentIDs = [];
  const email = req.user.email;

  Users.findOne({email}, (err, user) =>
  {
    if (err) return res.json({message: err});
    if (user)
    {
      Posts.create(
        {
          code: code,
          creator: user._id,
          votes: votes,
          comments: commentIDs
        },
        (err, ok) =>
        {
          if (err) return res.json({message: "Unable to post your code due to an error!"});
          return res.json({});
        }
      )
    }
    else 
    {
      return res.json({message: "You tried to post from a non existing account!"});
    }
  })
});

router.get("/api/code/list", (req, res) =>
{
  Posts.find({}, (err, posts) =>
  {
    if (err) return res.json({message: err});
    else return res.json({posts});
  })
});

router.get('/api/user/:id', (req, res) =>
{
  const ObjectId = req.params.id;
  Users.findOne({_id: ObjectId}, (err, user) =>
  {
    if (err) return res.json({message: "Didn't find user"})
    else return res.json({user});
  })
});

router.put('/api/vote/add', authenticateToken, (req, res) =>
{
  const username = req.user.username;
  const id = req.body.id;
  const vote = req.body.vote;

  if (vote === "up")
  {
    Users.findOneAndUpdate({username}, {$push: {upvotes: id}}).then();
    Posts.findOneAndUpdate({_id: id}, {$inc: {votes: 1}}).then();
  }
  else if (vote === "down")
  {
    Users.findOneAndUpdate({username}, {$push: {downvotes: id}}).then();
    Posts.findOneAndUpdate({_id: id}, {$inc: {votes: -1}}).then();
  }
  res.send("ok");
});

router.put('/api/vote/remove', authenticateToken, (req, res) =>
{
  const username = req.user.username;
  const id = req.body.id;
  const vote = req.body.vote;

  if (vote === "up")
  {
    Users.findOneAndUpdate({username}, {$pull: {upvotes: id}}).then();
    Posts.findOneAndUpdate({_id: id}, {$inc: {votes: -1}}).then();
  }
  else if (vote === "down")
  {
    Users.findOneAndUpdate({username}, {$pull: {downvotes: id}}).then();
    Posts.findOneAndUpdate({_id: id}, {$inc: {votes: 1}}).then();
  }

  res.send("ok");
});

router.put('/api/vote/update', authenticateToken, (req, res) =>
{
  const username = req.user.username;
  const id = req.body.id;
  const vote = req.body.vote;

  if (vote === "up")
  {
    Users.findOneAndUpdate({username}, {$push: {upvotes: id}, $pull: {downvotes: id}}).then();
    Posts.findOneAndUpdate({_id: id}, {$inc: {votes: 2}}).then();
  }
  else if (vote === "down")
  {
    Users.findOneAndUpdate({username}, {$push: {downvotes: id}, $pull: {upvotes: id}}).then();
    Posts.findOneAndUpdate({_id: id}, {$inc: {votes: -2}}).then();
  }

  res.send("ok");
})

router.get('/api/voted/:codeID', authenticateToken, (req, res) => 
{
  const email = req.user.email;
  const codeID = req.params.codeID;

  Users.findOne({email}, (err, user) =>
  {
    if (err) throw err;
    if (user)
    {
      if (user.upvotes.includes(codeID))
      {
        return res.json({vote: "up"});
      }
      else if (user.downvotes.includes(codeID))
      {
        return res.json({vote: "down"});
      }
      else
      {
        return res.json({vote: ""});
      }
    }
    else
    {
      return res.json({vote: ""});
    }
  })
});

router.get('/api/code/comments/:id', (req, res) =>
{
  const id = req.params.id;

  Comments.find({post: id}, (err, comments) =>
  {
    if (err) throw err;
    if (comments) return res.json({comments});
    else return res.json({message: "Couldn't find comments for the post"});
  })
});

router.post('/api/comment', authenticateToken, (req, res) => {
  const comment = req.body.comment;
  const post = req.body.post;
  const creator = req.body.creator;

  Comments.create({
    comment,
    creator,
    post
  },
  (err, ok) =>
  {
    if (err) throw err;
    if (ok) return res.json({success: true});
    else return res.json({success: false});
  });
});

router.put('/api/update/code', authenticateToken, (req, res) =>
{
  const _id = req.body._id;
  const code = req.body.code;

  Posts.findOneAndUpdate({_id}, {code}, (err, docs) =>
  {
    if (err) return res.json({success: false, message: "Error while updating code"});
    else return res.json({success: true, message: "Code updated succesfully"});
  })
});

module.exports = router;
