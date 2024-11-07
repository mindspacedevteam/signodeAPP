// utils/jweUtils.js
const crypto = require('crypto');

// Generate a symmetric key
const generateKey = () => {
    return crypto.randomBytes(32).toString('hex'); // 32 bytes = 256 bits
};

// Encrypt function to create JWE
const encrypt = (plaintext, key) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    // Construct JWE compact serialization
    return [
        Buffer.from('{"alg":"dir","enc":"A256GCM"}').toString('base64url'), // JWE header
        iv.toString('hex'),
        authTag,
        encrypted,
    ].join('.');
};

// Decrypt function to read JWE
const decrypt = (jwe, key) => {
    const parts = jwe.split('.');
    const iv = Buffer.from(parts[1], 'hex');
    const authTag = Buffer.from(parts[2], 'hex');
    const encryptedText = Buffer.from(parts[3], 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
};

// Export the functions for use in other modules
module.exports = {
    generateKey,
    encrypt,
    decrypt
};
