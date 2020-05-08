const Error = require("../error");
const bcrypt = require("bcryptjs");


class Users {
    constructor(db) {
        this.collection = db.collection("Users");
    }

    // Returns whether function received correct username + password combination 
    // If there is an incorrect username + password combination, returns an error 
    async login(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                // Retrieve user from the database by querying by username 
                const user = await this.collection.findOne({ username });
                if (user) {
                    // Compare password with encrypted password for this username 
                    const isMatching = await bcrypt.compare(password, user.password); 
                    if (isMatching) {
                        return resolve(true); 
                    }
                }
                return reject(new Error(401, "Username and password could not be matched"));
            }
            catch (e) {
                return reject(new Error(500, e));
            }
        })
    }

    async getUser(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.collection.findOne({username}); 
                if (user) {
                    return resolve(user); 
                }
                return reject(new Error(404, `Could not find user in the database with username: ${username}`))
            }
            catch(e) {
                return reject(new Error(500, e));
            }
        })
    }
}
module.exports = Users; 