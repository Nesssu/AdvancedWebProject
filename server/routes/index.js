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

router.put('/api/vote/add', (req, res) =>
{
  const username = req.body.username;
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

router.put('/api/vote/remove', (req, res) =>
{
  const username = req.body.username;
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

router.put('/api/vote/update', (req, res) =>
{
  const username = req.body.username;
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

router.get('/api/voted/:email/:codeID', (req, res) => 
{
  const email = req.params.email;
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

router.post('/api/comment', (req, res) => {
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
  })

});

module.exports = router;
