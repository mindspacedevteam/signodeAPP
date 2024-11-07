const jose = require('jose');
const { CompactEncrypt } = jose;

// Function to generate a JWE token
const generateToken = async (userData) => {
    const { userId, jwt_secret } = userData;

    // Generate a proper key by hashing or using a substring of the secret
    const key = new TextEncoder().encode(jwt_secret).slice(0, 32); // Take the first 32 bytes (256 bits)

    const jweToken = await new CompactEncrypt(
        new TextEncoder().encode(JSON.stringify({ userId })) // Encrypt userId as bytes
    )
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }) // Set the protected header
    .encrypt(key); // Encrypt using the fixed key

    return jweToken; // Return the generated JWE token
};
// Function to decrypt a JWE token
const decryptToken = async (jweToken, jwt_secret) => {
    const decryptionKey = new TextEncoder().encode(jwt_secret); // Encode the secret as bytes

    try {
        // Decrypt the JWE token
        const { plaintext } = await jose.compactDecrypt(jweToken, decryptionKey); // Use compactDecrypt
        return JSON.parse(new TextDecoder().decode(plaintext)); // Decode and parse the decrypted token
    } catch (error) {
        console.error('Decryption error:', error); // Log the error for debugging
        throw new Error('Invalid token'); // Throw an error for invalid tokens
    }
};

module.exports = { generateToken, decryptToken };
