// utils/cryptoUtils.js
const crypto = require('crypto');

// Load AES key and IV from environment variables
const AES_KEY = process.env.AES_KEY;
const AES_IV = process.env.AES_IV;

// Encrypt data
function encryptData(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_KEY, 'hex'), Buffer.from(AES_IV, 'hex'));
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// Decrypt data
function decryptData(encryptedData) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_KEY, 'hex'), Buffer.from(AES_IV, 'hex'));
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

module.exports = { encryptData, decryptData };
