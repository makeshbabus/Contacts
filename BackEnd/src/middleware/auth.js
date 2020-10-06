const config = require('../config');

const auth = (req, res, next) => {
    var user;
    try {

         // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if(username===config.username && password===config.password)
    {
        user = config.username;
    }
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }       
  
        
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth