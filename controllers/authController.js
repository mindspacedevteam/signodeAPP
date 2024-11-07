// controllers/authController.js

const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Import crypto to generate unique secrets
const pool = require('../utils/db'); // Import your database connection
const { generateToken, decryptToken } = require('../utils/hashUtils'); // Import the token utilities

// User Registration Endpoint
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique JWT secret
        const jwtSecret = crypto.randomBytes(32).toString('hex'); // Generate a random secret

        // Call the stored procedure to register the user
        await pool.query('CALL sp_register_user(?, ?)', [username, hashedPassword]);

        // After user registration, insert the JWT secret into the user_tokens table
        const [result] = await pool.query('SELECT LAST_INSERT_ID() AS userId'); // Get the last inserted user ID
        const userId = result[0].userId;

        // Insert the unique JWT secret and set token to NULL (or '' if you prefer) into the user_tokens table
        await pool.query('INSERT INTO st_user_tokens (f_sys_cd_usr, jwt_secret, token) VALUES (?, ?, ?)', [userId, jwtSecret, null]);

        res.json({ message: 'User registered successfully', jwtSecret }); // Optionally return the secret for testing
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === '45000') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error registering user' });
    }
};

// User Login Endpoint
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Call the stored procedure for login and get user details
        const [result] = await pool.query('CALL sp_login_user(?,?)', [username, password]);

        const userData = result[0][0]; // Assuming the first result set returns user data

        // Check if userData is not null or undefined and has a password
        if (!userData || !userData.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('User Data:', userData); // Debugging information

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = await generateToken(userData);
        console.log('token.....>>>',token)
        console.log('User ID:', userData.userId);
        console.log('JWT Secret:', userData.jwt_secret);
        // Upsert user token
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        await pool.query(
            'CALL sp_upsert_user_token(?, ?, ?, ?)', 
            [userData.userId, userData.jwt_secret, token, expiryDate]
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

// Protected Route Example
const protectedRoute = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token format

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        const userData = decryptToken(token, userData.jwt_secret); // Pass the user's JWT secret
        // Proceed with your logic using userData
        res.json({ message: 'Protected data', user: userData });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    protectedRoute
};
