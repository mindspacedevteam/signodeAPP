const crypto = require('crypto');

// Replace with your own secret key
const AES_KEY = Buffer.from('4A6F8C7B0A1F5D6C3B9E8D7A6F1C2B4D4A6F8C7B0A1F5D6C3B9E8D7A6F1C2B4D', 'hex'); // 32 bytes
const AES_IV = Buffer.from('9F2C4E6A8B1D3F0A9F2C4E6A8B1D3F0A', 'hex'); // 16 bytes

// Encrypt function
function encrypt(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// Decrypt function
function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}


async function updateMTLStatus(req, res) {
    try {
        // Decrypt the incoming data
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ message: 'Encrypted data is required' });
        }

        // Decrypt the data using the decrypt function
        const decryptedData = decrypt(data);

        // The decrypted data should now be directly available
        const { HdrId, HdrNumber, LabelNumber, UserId } = decryptedData;

        // Check if the required fields are present
        if (!HdrId || !HdrNumber || !LabelNumber || !UserId) {
            return res.status(400).json({ message: 'All parameters are required' });
        }

        // Simulate the behavior of the stored procedure
        const returnStatus = 'OK'; // Simulated return status from stored procedure
        let successMessage = null;
        let failureMessage = null;

        // Logic to determine success or failure messages
        if (HdrNumber === 'PL_CKD_2W_ZAH_03_25OCT202400050') {
            successMessage = {
                PartNo: '264126806304',
                PartDesc: 'SPACER GEAR SHIFT LEVER',
                LotNumber: 'DAA 24 07 00 0111',
                LotQty: 2,
                LotSize: 2,
                Total: 4,
                Count: 24,
            };
        } else if (HdrNumber === 'PL_CKD_2W_ZAH_03_25OCT202400019') {
            // Return the specific unauthorized message
            failureMessage = {
                ErrorMessage: `User ${UserId} not authorized to update MTL status for ${LabelNumber}`,
                ReturnStatus: 'Fail',
            };
        } else {
            failureMessage = {
                ErrorMessage: `No valid action for user ${UserId} with header number ${HdrNumber}`,
                ReturnStatus: 'Fail',
            };
        }

        const response = {
            ReturnStatus: returnStatus,
            SuccessMessage: successMessage || null,
            FailureMessage: failureMessage || null,
        };

        // Encrypt the response before sending it back
        const encryptedResponse = encrypt(response);
        res.json({ data: encryptedResponse });

    } catch (error) {
        console.error('Error updating MTL status:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


module.exports = { updateMTLStatus };
