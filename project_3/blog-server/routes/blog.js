const express = require("express");
const router = express.Router();
const Error = require("../error");

/* GET a blog post with postid and username */
router.get("/:username/:postid", async (req, res) => {
  if (isNaN(req.params.postid)) {
    return res.status(404).render("error", { error: new Error(400, "Postid is not a number!") });
  }
  const username = req.params.username;
  const postid = parseInt(req.params.postid);

  try {
    // Query for whether User with username exists in the database 
    const Users = req.app.get("db").Users;
    await Users.getUser(username); 

    // Query for the post using username and postid
    const Posts = req.app.get("db").Posts;
    const post = await Posts.getPost(username, postid);
    res.render("post", { post, username });
  }
  catch (error) {
    console.log(error);
    return res.status(error.statusCode).render("error", { error });
  }
});

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const startFrom = req.query.start ? parseInt(req.query.start) : 1;

  try {
    // Query for whether User with username exists in the database 
    const Users = req.app.get("db").Users;
    await Users.getUser(username); 

    // Query for user's posts for postid >= startFrom
    const Posts = req.app.get("db").Posts;
    let posts = await Posts.getUserPostsStartingFrom(username, startFrom);
    
    let nextPageUrl;
    if (posts.length > 5) {
      // Limit the number of posts to display to 5 
      posts = posts.slice(0, 5);
      // Compute the start query parameter to leave off on the last postid 
      let lastPostId = posts[4].postid;
      nextPageUrl = `/blog/${username}?start=${lastPostId + 1}`
    }
    res.render("blog", { username, posts, nextPageUrl });
  }
  catch(error) {
    console.log(error);
    return res.status(error.statusCode).render("error", { error });
  }
});

module.exports = router;
