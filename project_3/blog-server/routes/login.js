const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("", async (req, res) => {
    res.status(200).render("login", { redirect: req.query.redirect, username: "", password: "" });
})

router.post("", async (req, res) => {
    // Retrieve username and password from the request body 
    const { username, password } = req.body;
    try {
        const Users = req.app.get("db").Users;
        await Users.login(username, password);
    }
    catch (e) {
        // Could not login due to an error 
        return res.status(e.statusCode).render("login", { username, password, redirect: req.body.redirect });
    }

    // Set authentication session token to expire in 2 hours  
    let expirationTime = (Date.now() / 1000) + 7200;
    const token = jwt.sign({ usr: username, exp: expirationTime }, req.app.get("JWT_SECRET_KEY"));
    res.cookie("jwt", token);

    // Redirect if necessary 
    if (req.body.redirect) {
        return res.redirect(req.body.redirect);
    }
    return res.status(200).send("Success");
})

module.exports = router;
