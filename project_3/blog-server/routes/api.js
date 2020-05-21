var express = require('express');
var router = express.Router();
// Middleware to check whether the JWT cookie is valid 
const cookieAuth = require("../middleware/jwtTokenAuthenticator");


// Get all posts made by a user 
router.get('/:username', cookieAuth, async (req, res, next) => {
  const Posts = req.app.get("db").Posts;
  try {
    const posts = await Posts.getUserPostsStartingFrom(req.params.username, 0);
    res.status(200).send(posts);
  }
  catch (error) {
    next(error);
  }
});

// Get a post made by a user 
router.get('/:username/:postid', cookieAuth, async (req, res, next) => {
  if (isNaN(req.params.postid)) {
    return res.status(400).render("error", { error: new Error(400, "Postid is not a number!") });
  }
  try {
    const Posts = req.app.get("db").Posts;
    const post = await Posts.getPost(req.params.username, parseInt(req.params.postid));
    res.status(200).send(post);
  }
  catch (error) {
    next(error);
  }
});

// Add a new post 
router.post('/:username/:postid', cookieAuth, async (req, res, next) => {
  if ((req.body.title === null || req.body.title === undefined) && (req.body.body === null || req.body.body === undefined)) {
    return next(new Error(400));
  }
  if (isNaN(req.params.postid)) {
    return next(new Error(400, "Postid is not a number!"));
  }

  try {
    const Posts = req.app.get("db").Posts;
    const post = await Posts.addPost(req.params.username, parseInt(req.params.postid), req.body.title, req.body.body);
    res.status(201).send("Created");
  }
  catch (error) {
    next(error);
  }
})

// Update a new post 
router.put('/:username/:postid', cookieAuth, async (req, res, next) => {
  if ((req.body.title === null || req.body.title === undefined) && (req.body.body === null || req.body.body === undefined)) {
    return next(new Error(400));
  }

  if (isNaN(req.params.postid)) {
    return next(new Error(400, "Postid is not a number!"))
  }

  try {
    const Posts = req.app.get("db").Posts;
    await Posts.updatePost(req.params.username, parseInt(req.params.postid), req.body.title, req.body.body);
    res.status(200).send("Updated");
  }
  catch (error) {
    return next(error);
  }
})


// Delete an existing post 
router.delete('/:username/:postid', cookieAuth, async (req, res, next) => {
  if (isNaN(req.params.postid)) {
    next(new Error(400, "Postid is not a number!"));
  }

  try {
    const Posts = req.app.get("db").Posts;
    await Posts.deletePost(req.params.username, parseInt(req.params.postid));
    res.status(204).send("No content");
  }
  catch (error) {
    next(error);
  }
})


module.exports = router;
