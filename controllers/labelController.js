// controllers/labelController.js
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

// Dummy response data for each label creation level
const dummyResponses = {
    primary: {
        success: true,
        message: "Created Primary for given Pick Label",
        data: {
            LabelType: "Single",
            PartNo: "252709145829_175",
            PartDesc: "REDUCER HOSE (AIR FILTER TO PIPE)",
            LotNumber: "DAA 24 07 00 0111",
            LotQty: 2,
            LotSize: 2,
            Total: 4,
            Count: 86,
        },
    },
    secondary: {
        success: true,
        message: "Created Secondary for given Primary List",
        SecondaryCreatedCount: 4,
    },
    tertiary: {
        success: true,
        message: "Created Tertiary for given Primary & Secondary",
        TertiaryCreatedCount: 2,
    },
};

// Function to execute SP_CreateLabelType stored procedure for Primary Label
async function createPrimaryLabel(req, res) {
    const { data } = req.body;
        if (!data) {
            return res.status(400).json({ message: 'Encrypted data is required' });
        }

        // Decrypt the data using the decrypt function
        const decryptedData = decrypt(data);
    const { LevelType, Prim_Second_Tert_List = [] } = decryptedData;

    if (LevelType === 'Primary' && Prim_Second_Tert_List.length > 0) {
        const encryptedResponse = encrypt(dummyResponses.primary);
        res.json({ data: encryptedResponse });
        // return res.json(dummyResponses.primary);
    } else {
        return res.status(400).json({
            success: false,
            message: "Failed to create primary label - Invalid input",
            error: "LevelType must be 'Primary' and Prim_Second_Tert_List is required",
        });
    }
}

// Function to execute SP_CreateLabelType for creating Secondary Label
async function createSecondaryLabel(req, res) {
    const { data } = req.body;
        if (!data) {
            return res.status(400).json({ message: 'Encrypted data is required' });
        }

        // Decrypt the data using the decrypt function
        const decryptedData = decrypt(data);
    const { LevelType = 'Secondary', HdrId, HdrNumber, Prim_Second_Tert_List = [], UserId } = decryptedData;

    if (!HdrId || !HdrNumber || !UserId) {
        return res.status(400).json({
            success: false,
            message: "Failed to create secondary label - Missing required fields",
            error: "HdrId, HdrNumber, and UserId are required.",
        });
    }

    if (LevelType === 'Secondary' && Prim_Second_Tert_List.length > 0) {
        if (Prim_Second_Tert_List.includes('PR_CKD_2W_ZAH_01_25OCT202400035$DAA 24 07 00 0111')) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to create Secondary level",
                error: `Authorization error for user ${UserId}`,
            });
        }
        const encryptedResponse = encrypt(dummyResponses.secondary);
        res.json({ data: encryptedResponse });
        // return res.json(dummyResponses.secondary);
    } else {
        return res.status(400).json({
            success: false,
            message: "Failed to create secondary label - Invalid input",
            error: "LevelType must be 'Secondary' and Prim_Second_Tert_List is required",
        });
    }
}

// Function to execute SP_CreateLabelType for creating Tertiary Label
async function createTertiaryLabel(req, res) {
    const { data } = req.body;
        if (!data) {
            return res.status(400).json({ message: 'Encrypted data is required' });
        }

        // Decrypt the data using the decrypt function
        const decryptedData = decrypt(data);
    const { LevelType = 'Tertiary', Prim_Second_Tert_List = [], UserId } = decryptedData;

    if (!UserId) {
        return res.status(400).json({
            success: false,
            message: "Failed to create tertiary label - Missing required fields",
            error: "UserId is required.",
        });
    }

    if (LevelType === 'Tertiary' && Prim_Second_Tert_List.length > 0) {
        if (Prim_Second_Tert_List.includes('SL_CKD_2W_ZAH_01_25OCT202400004$DAA 24 07 00 0111')) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to create Tertiary level",
                error: `Authorization error for user ${UserId}`,
            });
        }
        const encryptedResponse = encrypt(dummyResponses.tertiary);
        res.json({ data: encryptedResponse });
        // return res.json(dummyResponses.tertiary);
    } else {
        return res.status(400).json({
            success: false,
            message: "Failed to create tertiary label - Invalid input",
            error: "LevelType must be 'Tertiary' and Prim_Second_Tert_List is required",
        });
    }
}

module.exports = { createPrimaryLabel, createSecondaryLabel, createTertiaryLabel };
