const MongoClient = require("mongodb").MongoClient;
const Posts = require("../controller/posts");
const Users = require("../controller/users");

const DB_NAME = "BlogServer";
const DB_URL = "mongodb://localhost:27017/";

var mongodb;

class MongoDb {
  constructor() {
    this.client = new MongoClient(DB_URL, { useUnifiedTopology: true });
  }

  async init() {
    await this.client.connect();
    console.log("Successfuly connected to MongoDB");
    this.db = this.client.db(DB_NAME);
    this.Posts = new Posts(this.db);
    this.Users = new Users(this.db);
  }
}

module.exports = new MongoDb();
