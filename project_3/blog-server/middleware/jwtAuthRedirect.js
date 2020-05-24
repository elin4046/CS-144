const jwt = require("jsonwebtoken");

// Redirect to /login to obtain jwt token 
const authenticationRedirect = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return res.redirect("/login?redirect=/editor/");
    }
    const payload = await jwt.verify(req.cookies.jwt, req.app.get("JWT_SECRET_KEY"), { algorithms: ["HS256"] });
    const Users = req.app.get("db").Users;
    const user = await Users.getUser(payload.usr);
    if (payload.usr !== user.username) {
      return res.redirect("/login?redirect=/editor/");
    }
  }
  catch (e) {
    return res.redirect("/login?redirect=/editor/");
  }
  next();
}

module.exports = authenticationRedirect;
