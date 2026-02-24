const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mi_clave_super_secreta_123'; // Master key for JWT signing 

const generateAccessToken = (user) => {
    const payload = {
        id: user.id,
        role: user.role,
        name: user.name
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' }); // Token expires, for example after 8 hours
};

module.exports = {
    generateAccessToken
};