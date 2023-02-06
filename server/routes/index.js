const express = require('express');
const router = express.Router();
const Posts = require('../models/Post');
const Comments = require('../models/Comment');
const Users = require('../models/User');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/api/code/add", (req, res) =>
{
  const code = req.body.code;
  const votes = 0;
  const commentIDs = [];
  const votedIDs = [];
  const email = req.body.email;

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

router.post("/api/add/comment", (req, res) =>
{
  // Add comment to code snippet
  return res.send("ok");
});

router.get("/api/comments", (req, res) =>
{
  // Get comments to code
  return res.send("ok");
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

router.put('/api/vote/update', (req, res) =>
{
  const username = req.body.username;
  const id = req.body.id;
  const vote = req.body.vote;
  const newVote = req.body.newVote;
  const removeVote = req.body.removeVote;

  if (newVote)
  {
    vote === "up" ? Users.findOneAndUpdate({username}, {$push: {upvote: id}}).then((err, ok)  => {if (ok) console.log("ok")}) : Users.findOneAndUpdate({username}, {$push: {downvote: id}}).then((err, ok)  => {if (ok) console.log("ok")});
    vote === "up" ? Posts.findOneAndUpdate({_id: id}, {$inc: {votes: 1}}).then((err, ok)  => {if (ok) console.log("ok")}) : Posts.findOneAndUpdate({_id: id}, {$inc: {votes: -1}}).then((err, ok)  => {if (ok) console.log("ok")});
  }
  else if (removeVote)
  {
    vote === "up" ? Users.findOneAndUpdate({username}, {$pull: {upvote: id}}).then((err, ok)  => {if (ok) console.log("ok")}) : Users.findOneAndUpdate({username}, {$pull: {downvote: id}}).then((err, ok)  => {if (ok) console.log("ok")});
  }
  else
  {
    vote === "up" ? Posts.findOneAndUpdate({_id: id}, {$inc: {votes: 1}}).then((err, ok)  => {if (ok) console.log("ok")}) : Posts.findOneAndUpdate({_id: id}, {$inc: {votes: -1}}).then((err, ok)  => {if (ok) console.log("ok")});
  }
  
  res.send("ok");
})

module.exports = router;
