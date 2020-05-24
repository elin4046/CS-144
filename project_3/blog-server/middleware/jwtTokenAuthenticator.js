const jwt = require("jsonwebtoken");
const Error = require("../error");

const checkJWTToken = async (req, res, next) => {
    if (!req.params.username || !req.cookies.jwt) {
        return res.status(400).render("error", { error: new Error(400, "Missing parameters to verify cookie!") });
    }
    try {
        const payload = await jwt.verify(req.cookies.jwt, req.app.get("JWT_SECRET_KEY"), { algorithms: ["HS256"] });
        // Cookie does not contain matching username 
        if (payload.usr !== req.params.username) {
            return res.status(401).render("error", { error: new Error(401, "JWT cookie contains mismatching usernames!") });
        }
    }
    catch (e) {
        // Cookie is expired or could not be verified
        return res.status(401).render("error", { error: new Error(401, "JWT cookie cannot be verified!") });
    }
    next();
}
module.exports = checkJWTToken; 