const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/api/add", (req, res) =>
{
  // Add new code snippet
  return res.send("ok");
});

router.get("/api/code/snippets", (req, res) =>
{
  // Get code snippets from db
  return res.send("ok");
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
})

module.exports = router;
