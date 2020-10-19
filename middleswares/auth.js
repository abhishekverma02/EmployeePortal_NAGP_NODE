const expressJwt = require('express-jwt');

function isAuthenticated(){

    let result = expressJwt({secret:process.env.JWT_SECRET, algorithms: ['HS256']});
    return result;
}

module.exports = {isAuthenticated};