// middleware/decryptMiddleware.js
const { decryptData } = require('../utils/cryptoUtils');

function decryptRequest(req, res, next) {
    if (req.headers['x-encrypted'] === 'true' && req.body.data) {
        try {
            req.body = decryptData(req.body.data); // Decrypt and replace request body
        } catch (error) {
            return res.status(400).json({ error: 'Invalid encrypted data' });
        }
    }
    next();
}

module.exports = decryptRequest;
