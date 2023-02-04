var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", (req, next) =>
{
  // Register user
  return res.send("ok");
})

router.post("/login", (req, res) =>
{
  // Login user
  return res.send("ok");
})



module.exports = router;
