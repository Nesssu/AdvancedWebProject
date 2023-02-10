const express = require('express');
const router = express.Router();
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

// Middleware used to authenticate the user
const authenticateToken = (req, res, next) =>
{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).send("Unauthorized");

  jwt.verify(token, 'bananaboat', (err, user) =>
  {
    if (err) return res.status(401).json({message: "unauthorized"});

    req.user = user;
    next();
  })
}

// Route to register new users. Email and password validation is done with express-validator middleware
router.post("/users/register",
  upload.none(),
  body('email').isEmail(),
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }),
  (req, res, next) =>
{
  const errors = validationResult(req);

  if (!errors.isEmpty())
  {
    return res.json({message: "Password is not strong enough"});
  }

  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  User.findOne({$or: [{email}, {username}]}, (err, user) =>
  {
    if (err) throw err;
    if (user) return res.json({message: "Email or username already in use"});
    else
    {
      bcrypt.genSalt(10, (err, salt) =>
      {
        bcrypt.hash(password, salt, (err, hash) =>
        {
          if (err) throw err;
          User.create(
            {
              email: email,
              password: hash,
              username: username,
              upvotes: [],
              downvotes: []
            },
            (err, ok) =>
            {
              if (err) throw err;
              // If registration is succesful, an empty object is sent to the client.
              return res.json({});
            }
          )
        })
      })
    }
  })
});

// Route to login the user. 
router.post("/users/login", (req, res, next) =>
{
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email}, (err, user) =>
  {
    if (err) throw err;
    if (!user) return res.json({message: "Invalid credentials"});
    else
    {
      bcrypt.compare(password, user.password, (err, isMatch) =>
      {
        if (err) throw err;
        if (isMatch)
        {
          const payload = {
            email: user.email,
            username: user.username,
            id: user._id,
            joined: user.createdAt
          }
          jwt.sign(
            payload,
            'bananaboat',
            {
              expiresIn: 100000
            },
            (err, token) =>
            {
              if (err) throw err;
              // If login is succesful, a jwt token is sent to the client
              return res.json({token});
            }
          )
        }
        else
        {
          return res.json({message: "Invalid credentials"});
        }
      })
    }
  })
});

// Route that allows the user to update their username
router.put('/users/update/username', authenticateToken, (req, res) => 
{
  const email = req.user.email;
  const newUsername = req.body.newUsername;

  User.findOneAndUpdate({email}, {username: newUsername}, (err, docs) =>
  {
    if (err) return res.json({success: false, message: "Error while updating username"});
    else return res.json({success: true, message: "Username updated"});
  });
});

// Route that allows the user to update their email address
router.put('/users/update/email', authenticateToken, (req, res) =>
{
  const username = req.user.username;
  const newEmail = req.body.newEmail;

  User.findOneAndUpdate({username}, {email: newEmail}, (err, docs) =>
  {
    if (err) return res.json({success: false, message: "Error while updatign email"});
    else return res.json({success: true, message: "Email updated"});
  });
});

module.exports = router;
