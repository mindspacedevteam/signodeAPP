const { JWE, importJWK } = require('jose');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        // Import symmetric key
        const key = await importJWK({ kty: 'oct', k: Buffer.from(process.env.JWT_SECRET, 'hex').toString('base64') });

        // Decrypt the token using JWE
        const { plaintext } = await JWE.decrypt(token, key);
        const user = JSON.parse(plaintext.toString());

        req.user = user;
        next();
    } catch (err) {
        console.error('Invalid token:', err);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
