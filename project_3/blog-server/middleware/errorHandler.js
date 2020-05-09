const Error = require("../error"); 
const handleError = async (error, req, res, next) => {
    // If the error wasn't specified, then return 400: Bad Request 
    if (!error || !(error instanceof Error)) {
        return res.status(400).render("error", {error: new Error(400)});
    }
    return res.status(error.statusCode).render("error", {error});
}

module.exports = handleError; 