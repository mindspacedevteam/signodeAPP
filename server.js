// server.js

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { registerUser, loginUser } = require('./controllers/authController');
const authenticateToken = require('./middleware/authMiddleware');
const mtlRoutes = require('./routes/mtlRoutes');
const labelRoutes = require("./routes/labelRoutes");
// const { connectToDatabase } = require("./utils/dbConfig");
const printDataRoutes = require('./routes/printDataRoutes');
const userWiseSiteRoutes = require('./routes/userWiseSiteRoutes');

// Connect to the database
// connectToDatabase();
const app = express();
app.use(bodyParser.json());

const AES_KEY = Buffer.from('4A6F8C7B0A1F5D6C3B9E8D7A6F1C2B4D4A6F8C7B0A1F5D6C3B9E8D7A6F1C2B4D', 'hex'); // 32 bytes
const AES_IV = Buffer.from('9F2C4E6A8B1D3F0A9F2C4E6A8B1D3F0A', 'hex'); // 16 bytes

// Encrypt function
function encryptData(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// Decrypt function
function decryptData(encryptedData) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);  // The result will be the original object
}

// Endpoint to encrypt user input
app.post('/api/encrypt', (req, res) => {
    const userInput = req.body.text; // Expecting JSON with a "text" key
    if (!userInput) {
        return res.status(400).json({ error: 'Text input is required.' });
    }
    
    // Encrypt only the original data (not wrapping it in an extra "message" key)
    const encryptedResponse = encryptData(userInput);
    res.json({ data: encryptedResponse });
});

// Endpoint to decrypt encrypted input
app.post('/api/decrypt', (req, res) => {
    const encryptedInput = req.body.data; // Expecting JSON with a "data" key
    if (!encryptedInput) {
        return res.status(400).json({ error: 'Encrypted data is required.' });
    }
    
    try {
        // Decrypt and return the original data directly
        const decryptedResponse = decryptData(encryptedInput);
        res.json(decryptedResponse);  // Return the original object
    } catch (error) {
        res.status(500).json({ error: 'Failed to decrypt the data.' });
    }
});
// const AES_KEY = Buffer.from('4A6F8C7B0A1F5D6C3B9E8D7A6F1C2B4D4A6F8C7B0A1F5D6C3B9E8D7A6F1C2B4D', 'hex'); // 32 bytes
// const AES_IV = Buffer.from('9F2C4E6A8B1D3F0A9F2C4E6A8B1D3F0A', 'hex'); // 16 bytes
// console.log('AES_KEY',AES_KEY.length);
// console.log('AES_IV',AES_IV.length);
// function encryptData(data) {
//     const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
//     let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
//     encrypted += cipher.final('base64');
//     return encrypted;
// }

// function decryptData(encryptedData) {
//     const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
//     let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
//     decrypted += decipher.final('utf8');
//     return JSON.parse(decrypted);
// }

// // Endpoint to encrypt user input
// app.post('/api/encrypt', (req, res) => {
//     const userInput = req.body.text; // Expecting JSON with a "text" key
//     if (!userInput) {
//         return res.status(400).json({ error: 'Text input is required.' });
//     }
    
//     const encryptedResponse = encryptData({ message: userInput });
//     res.json({ data: encryptedResponse });
// });

// // Endpoint to decrypt encrypted input
// app.post('/api/decrypt', (req, res) => {
//     const encryptedInput = req.body.data; // Expecting JSON with a "data" key
//     if (!encryptedInput) {
//         return res.status(400).json({ error: 'Encrypted data is required.' });
//     }
    
//     try {
//         const decryptedResponse = decryptData(encryptedInput);
//         res.json({ decryptedData: decryptedResponse });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to decrypt the data.' });
//     }
// });
// User Registration Endpoint
app.post('/auth/register', registerUser);

// User Login Endpoint
app.post('/auth/login', loginUser);

// Protected route
app.get('/protected-endpoint', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}! This is a protected route.` });
});

app.use('/api/mtl', mtlRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api', printDataRoutes);
app.use('/api', userWiseSiteRoutes);


// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
