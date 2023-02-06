const express = require('express');
const router = express.Router();
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

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
              return res.json({});
            }
          )
        })
      })
    }
  })
})

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
            email: user.email
          }
          jwt.sign(
            payload,
            'secrets',
            {
              expiresIn: 10000
            },
            (err, token) =>
            {
              if (err) throw err;
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
})



module.exports = router;
