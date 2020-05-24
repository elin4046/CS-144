var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var blogRouter = require("./routes/blog");
var apiRouter = require("./routes/api");
var loginRouter = require("./routes/login");

var mongo = require("./db/mongodb");
var handleError = require("./middleware/errorHandler");
var jwtAuthRedirect = require("./middleware/jwtAuthRedirect");

var app = express();
// Start up the mongodb database
const startDatabase = async () => {
  await mongo.init();
  app.set("db", mongo);
};
startDatabase();


// Store JWT secret key 
app.set("JWT_SECRET_KEY", "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/blog", blogRouter);
app.use("/api", apiRouter);
app.use("/login", loginRouter);
app.use(jwtAuthRedirect);
app.use(express.static(path.join(__dirname, "public")));
app.use(handleError);


module.exports = app;
