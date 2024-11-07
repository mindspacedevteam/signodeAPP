const crypto = require('crypto');
// const { sql } = require('../utils/dbConfig');

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

// Dummy data to return
const dummyData = [
    {
        SCId: 1,
        SiteId: 2415,
        SiteName: "Mahindra And Mahindra Limited-Telangana",
        LotNumber: "DAA 24 07 00 01",
        PLHdrId: 3,
        HPickLabelNum: "PL_CKD_2W_ZAH_03_25OCT2024",
        PRHdrId: 1,
        HPRLevelNum: "PR_CKD_2W_ZAH_01_25OCT2024",
        HSLLevelNum: "SL_CKD_2W_ZAH_01_25OCT2024",
        SLHdrId: 1,
        HTRLLevelNum: "BOX_CKD_2W_ZAH_01_25OCT2024",
        TRLHdrId: 1,
        HCNTLevelNum: null,
        CNTHdrId: null,
        MONTH: "Aug-24",
        TrackerType: "CKD",
        Product: "Two Wheeler",
    },
    {
        SCId: 2,
        SiteId: 2415,
        SiteName: "Mahindra And Mahindra Limited-Telangana",
        LotNumber: "DAA 24 07 00 012",
        PLHdrId: 4,
        HPickLabelNum: "PL_SKD_3W_ZAH_04_31OCT2024",
        PRHdrId: null,
        HPRLevelNum: null,
        HSLLevelNum: null,
        SLHdrId: null,
        HTRLLevelNum: null,
        TRLHdrId: null,
        HCNTLevelNum: null,
        CNTHdrId: null,
        MONTH: "Jul-24",
        TrackerType: "SKD",
        Product: "Three Wheeler",
    }
];

const getUserWiseSite = async (req, res) => {
    
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    try {
        // Handle request decryption (if needed)
        const encryptedRequestData = req.body.data; // Assume the encrypted data comes in the body

        // Decrypt the incoming request data
        let decryptedRequestData;
        if (encryptedRequestData) {
            decryptedRequestData = decrypt(encryptedRequestData);
            console.log("Decrypted Request Data: ", decryptedRequestData); // Log for debugging
        }

        // Here, we would typically process the decrypted data and possibly query the database
        // However, for now, we return dummy data

        // Notification logic based on dummy data
        const notifications = dummyData.map(row => {
            const messages = [];
            if (!row.PRHdrId) {
                messages.push("Create Header for Primary.");
            }
            if (!row.HPRLevelNum) {
                messages.push("Create Header for HPR Level.");
            }
            if (!row.SLHdrId) {
                messages.push("Create Header for SL Level.");
            }
            if (!row.HTRLLevelNum) {
                messages.push("Create Header for HTRL Level.");
            }
            if (!row.TRLHdrId) {
                messages.push("Create Header for TRL Level.");
            }
            if (!row.HCNTLevelNum) {
                messages.push("Create Header for HCNT Level.");
            }
            if (!row.CNTHdrId) {
                messages.push("Create Header for CNT Level.");
            }
            return {
                ...row,
                notifications: messages
            };
        });

        // Encrypt response data
        const encryptedResponseData = encrypt({ data: notifications }); // Only send notifications as part of the response
        res.status(200).json({ data: encryptedResponseData });
    } catch (err) {
        console.error("Error processing request:", err);
        res.status(500).json({ error: "Failed to process request" });
    }
};

module.exports = { getUserWiseSite };
