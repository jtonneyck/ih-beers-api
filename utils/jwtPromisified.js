const jwt = require('jsonwebtoken');

var verify = function(token){
    return (
        new Promise(function(resolve, reject){  
            try {
                var decoded = jwt.verify(token, process.env.JWT_SECRET)
                resolve(decoded)
            }
            catch(err) {
                reject(err)
            }
        }
    ))
}

module.exports = {
    ...jwt,
    verify
}