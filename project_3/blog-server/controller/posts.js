const commonmark = require("commonmark");
const Error = require("../error");


class Posts {
  constructor(db) {
    this.collection = db.collection("Posts");
  }

  // Add a new post 
  async addPost(username, postid, title, body) {
    return new Promise(async (resolve, reject) => {
      let post = {username, title, body};
      const currentTime = Date.now(); 
      post.postid = parseInt(postid); 
      post.modified = currentTime; 
      post.created = currentTime; 

      const existingPost = await this.collection.findOne({ username, postid });
      if (existingPost) {
        return reject(new Error(400, "A blog post already exists with this username and postid!"));
      }

      try {
        await this.collection.insertOne(post)
        return resolve("Success"); 
      }
      catch(e) {
        return reject(new Error(500, e));
      }
    })
  }

  // Update an existing post 
  async updatePost(username, postid, title, body) {
    return new Promise(async (resolve, reject) => {
      const existingPost = await this.collection.findOne({ username, postid });
      if (!existingPost) {
        return reject(new Error(400, "No blog post exists with this username and postid!"));
      }
      try {
        const currentTime = Date.now(); 
        await this.collection.updateOne({username, postid}, {$set: { title, body, modified: currentTime }})
        return resolve("Updated"); 
      }
      catch(e) {
        console.log(e)
        return reject(new Error(500, e));
      }
    })
  }

  // Delete an existing post 
  async deletePost(username, postid) {
    return new Promise(async (resolve, reject) => {
      const existingPost = await this.collection.findOne({ username, postid });
      if (!existingPost) {
        return reject(new Error(400, "No blog post exists with this username and postid!"));
      }

      try {
        await this.collection.deleteOne({username, postid})
        return resolve("Deleted"); 
      }
      catch(e) {
        console.log(e)
        return reject(new Error(500, e));
      }
    })
  }

  // Get a single post by querying with username and postid
  async getPost(username, postid, isPretty) {
    return new Promise(async (resolve, reject) => {
      let post;
      try {
        post = await this.collection.findOne({ username, postid });
      }
      catch (e) {
        return reject(new Error(500, e));
      }

      // Cannot find the post 
      if (!post) {
        return reject(new Error(404, "Cannot find post in database!"));
      }
      if (isPretty) {
        return resolve(prettyPrint(post));
      }
      return resolve(post);
    });
  }

  // Get at most 5 posts for a user starting with a postid
  async getUserPostsStartingFrom(username, start, isPretty) {
    return new Promise(async (resolve, reject) => {
      let posts;
      try {
        // Query the database for all posts associated with username with postid >= start 
        posts = await this.collection
          .find(
            { username, postid: { $gte: start } },
            { sort: "postid" }
          )
          .toArray();
      }
      catch (e) {
        return reject(new Error(500, e));
      }

      if (isPretty) {
        // Format each query result
        let prettyPosts = [];
        for (let i = 0; i < posts.length; i++) {
          prettyPosts.push(await prettyPrint(posts[i]));
        }
        return resolve(prettyPosts);
      }
      return resolve(posts); 
    });
  }
}

// Format a post
const prettyPrint = (post) => {
  return new Promise(async (resolve, reject) => {
    post.title = await renderMarkup(post.title);
    post.body = await renderMarkup(post.body);
    post.modified = await formatDate(post.modified);
    post.created = await formatDate(post.created);
    return resolve(post);
  });
};

// Render markup text to HTML
const renderMarkup = (markup) => {
  return new Promise(async (resolve, reject) => {
    const reader = new commonmark.Parser();
    const writer = new commonmark.HtmlRenderer();
    return resolve(writer.render(reader.parse(markup)));
  });
};

// Format a date into MM/DD/YYYY HH:MM
const formatDate = (unixEpoch) => {
  return new Promise(async (resolve, reject) => {
    const date = new Date(unixEpoch);
    let month = await convertToTwoDigits(date.getMonth());
    let day = await convertToTwoDigits(date.getDate());
    const year = date.getFullYear();
    let hours = await convertToTwoDigits(date.getHours());
    let minutes = await convertToTwoDigits(date.getMinutes());

    return resolve(`${month}/${day}/${year} ${hours}:${minutes}`);
  });
};

// Convert a number into two-digit format, eg. 1 => 01
const convertToTwoDigits = (num) => {
  return new Promise(async (resolve, reject) => {
    if (num < 10) {
      return resolve("0" + num);
    }
    return resolve(num);
  });
};

module.exports = Posts;
