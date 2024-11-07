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

// Main controller function
const printData = async (req, res) => {
    try {
        // Decrypt the incoming data
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ message: 'Encrypted data is required' });
        }

        // Decrypt the data using the decrypt function
        const decryptedData = decrypt(data);

        const { LevelType, HdrId, HdrNumber, LabelNumber } = decryptedData;

        // Validation to ensure all required fields are provided
        if (!LevelType || !HdrId || !HdrNumber || !LabelNumber) {
            return res.status(400).json({ message: 'All parameters are required' });
        }

        // Simulated header data
        const successMessage = {
            PRHeaders: [
                {
                    PRHdrId : 1,
                    SCId : 1,
                    SiteId : 2415,
                    SiteName :  'Mahindra And Mahindra Limited-Telangana' ,
                    LotNumber :  'DAA 24 07 00 0114,DAA 24 07 00 0113,DAA 24 07 00 0115,DAA 24 07 00 0112,DAA 24 07 00 0111' ,
                    LotNumberSize :  'DAA 24 07 00 01- 5' ,
                    PrdCode :  '2W' ,
                    TrackerType :  'CKD' ,
                    HPickLabelNum :  'PL_CKD_2W_ZAH_03_25OCT2024' ,
                    HPRLevelNum :  'PR_CKD_2W_ZAH_01_25OCT2024' ,
                    ModelNo :  'DAA071242KENRD' ,
                    ModelDesc :  'LP 712/42 WB E4 RHD CKD' ,
                    Field1 : null,
                    Field2 : null,
                    Field3 : null,
                    Field4 : null,
                    Field5 : null,
                    Field6 : null,
                    Field7 : null,
                    Field8 : null,
                    Field9 : null,
                    Field10 : null,
                    NField1 : null,
                    NField2 : null,
                    NField3 : null,
                    NField4 : null,
                    NField5 : null,
                    DField1 : null,
                    DField2 : null,
                    DField3 : null,
                    DField4 : null,
                    DField5 : null,
                    MTLStatus : 101,
                    MTLStatusName :  'Pending' ,
                    PLPrintStatus : 103,
                    PLPrintStatusName :  'Printed' ,
                    PRPrintStatus : 103,
                    PRPrintStatusName :  'Printed' ,
                    PRPrintDate :  '55:05.0' ,
                    Freeze : 104,
                    FreezedDate :  '17:01.6' ,
                    FreezeStatusName :  'Freeze' ,
                    UserId : 8504222,
                    CreatedDate :  '43:47.3' ,
                    CreatedBy : 8504432,
                    UpdatedDate : null,
                    UpdatedBy : null,
                    PRLineId : 1,
                    LPickLabelNum :  'PL_CKD_2W_ZAH_03_25OCT202400011' ,
                    LPRLevelNum :  'PR_CKD_2W_ZAH_01_25OCT202400001' ,
                    LPRNUM_LOT :  'PR_CKD_2W_ZAH_01_25OCT202400001$DAA 24 07 00 0111' ,
                    LPRLevelCount : 1,
                    LabelType :  'Single' ,
                    PartNo :  '265140107703_105' ,
                    PartDesc :  'FLAP' ,
                    Validity : 3,
                    LotQty : 6,
                    AvailableQty : 0,
                    LotNumber :  'DAA 24 07 00 0111' ,
                    REVANDSEQ :  'C  1' ,
                    StoreLoc : null,
                    Buyer : null,
                    BinLoc : null,
                    CTQ :  'AGGREGATE' ,
                    PickLabelType :  'INDIVIDUAL' ,
                    PartLabelType :  'SINGLE' ,
                    PkgStrategy : 0,
                    SplitQty : 0,
                    Carton : 0,
                    PairNo : 0,
                    UnitWeight : null,
                    TotalWeight : null,
                    MRP :  '40R' ,
                    VendorName : null,
                    GPart : null,
                    GroupNumber : null,
                    IsScannedViaWeb : null
                }
                 
            ],
            SLHeaders: [
                {
                    SLHdrId: 1,
                    SCId: 1,
                    SiteId: 2415,
                    SiteName: "Mahindra And Mahindra Limited-Telangana",
                    LotNumber: "DAA 24 07 00 0114,DAA 24 07 00 0113,DAA 24 07 00 0115,DAA 24 07 00 0112,DAA 24 07 00 0111",
                    LotNumberSize: "DAA 24 07 00 01- 5",
                    PrdCode: "2W",
                    TrackerType: "CKD",
                    HPickLabelNum: "PL_CKD_2W_ZAH_03_25OCT2024",
                    HPRLevelNum: "PR_CKD_2W_ZAH_01_25OCT2024",
                    HSLLevelNum: "SL_CKD_2W_ZAH_01_25OCT2024",
                    ModelNo: "DAA071242KENRD",
                    ModelDesc: "LP 712/42 WB E4 RHD CKD",
                    Field1: null,
                    Field2: null,
                    Field3: null,
                    Field4: null,
                    Field5: null,
                    Field6: null,
                    Field7: null,
                    Field8: null,
                    Field9: null,
                    Field10: null,
                    NField1: null,
                    NField2: null,
                    NField3: null,
                    NField4: null,
                    NField5: null,
                    DField1: null,
                    DField2: null,
                    DField3: null,
                    DField4: null,
                    DField5: null,
                    MTLStatus: 101,
                    MTLStatusName: "Pending",
                    PLPrintStatus: 103,
                    PLPrintStatusName: "Printed",
                    PRPrintStatus: 103,
                    PRPrintStatusName: "Printed",
                    PRPrintDate: null,
                    SLPrintStatus: 103,
                    SLPrintStatusName: "Printed",
                    SLPrintDate: "57:54.4",
                    Freeze: 104,
                    FreezedDate: "05:42.3",
                    FreezeStatusName: "Freeze",
                    UserId: 8504222,
                    CreatedDate: "20:33.9",
                    CreatedBy: 8504432,
                    UpdatedDate: null,
                    UpdatedBy: null,
                    SLLineId: 4,
                    LPickLabelNum: "PL_CKD_2W_ZAH_03_25OCT202400011",
                    LPRLevelNum: "PR_CKD_2W_ZAH_01_25OCT202400002",
                    LSLLevelNum: "SL_CKD_2W_ZAH_01_25OCT202400003",
                    LSLNUM_LOT: "SL_CKD_2W_ZAH_01_25OCT202400003$DAA 24 07 00 0111",
                    LPRLevelCount: 2,
                    LSLLevelCount: 3,
                    LabelType: "Single",
                    PartNo: "265140107703_105",
                    PartDesc: "FLAP",
                    Validity: 3,
                    LotQty: 6,
                    AvailableQty: 0,
                    LotNumber: "DAA 24 07 00 0111",
                    REVANDSEQ: "C  1",
                    StoreLoc: null,
                    Buyer: null,
                    BinLoc: null,
                    CTQ: "AGGREGATE",
                    PickLabelType: "INDIVIDUAL",
                    PartLabelType: null,
                    PkgStrategy: 0,
                    SplitQty: 0,
                    Carton: 0,
                    PairNo: 0,
                    UnitWeight: null,
                    TotalWeight: null,
                    MRP: "40R",
                    VendorName: null,
                    GPart: null,
                    GroupNumber: null,
                    IsScannedViaWeb: null
                  }
                  
            ],
            TRHeaders: [
                {
                    TRLHdrId: 1,
                    SCId: 1,
                    SiteId: 2415,
                    SiteName: "Mahindra And Mahindra Limited-Telangana",
                    LotNumber: "DAA 24 07 00 0114,DAA 24 07 00 0113,DAA 24 07 00 0115,DAA 24 07 00 0112,DAA 24 07 00 0111",
                    LotNumberSize: "DAA 24 07 00 01- 5",
                    PrdCode: "2W",
                    TrackerType: "CKD",
                    HPickLabelNum: "PL_CKD_2W_ZAH_03_25OCT2024",
                    HPRLevelNum: "PR_CKD_2W_ZAH_01_25OCT2024",
                    HSLLevelNum: "SL_CKD_2W_ZAH_01_25OCT2024",
                    HTRLLevelNum: "BOX_CKD_2W_ZAH_01_25OCT2024",
                    ModelNo: "DAA071242KENRD",
                    ModelDesc: "LP 712/42 WB E4 RHD CKD",
                    Field1: null,
                    Field2: null,
                    Field3: null,
                    Field4: null,
                    Field5: null,
                    Field6: null,
                    Field7: null,
                    Field8: null,
                    Field9: null,
                    Field10: null,
                    NField1: null,
                    NField2: null,
                    NField3: null,
                    NField4: null,
                    NField5: null,
                    DField1: null,
                    DField2: null,
                    DField3: null,
                    DField4: null,
                    DField5: null,
                    MTLStatus: 101,
                    MTLStatusName: "Pending",
                    PLPrintStatus: 103,
                    PLPrintStatusName: "Printed",
                    PRPrintStatus: 103,
                    PRPrintStatusName: "Printed",
                    SLPrintStatus: 103,
                    SLPrintStatusName: "Printed",
                    TRLPrintStatus: 103,
                    TRLPrintStatusName: "Printed",
                    TRLPrintDate: "02:50.0",
                    Freeze: 101,
                    FreezedDate: null,
                    FreezeStatusName: "Pending",
                    UserId: 8504222,
                    CreatedDate: "14:12.9",
                    CreatedBy: 8504432,
                    UpdatedDate: null,
                    UpdatedBy: null,
                    TRLLineId: 8,
                    BoxTypeId: 1,
                    BoxTypeName: "cacas",
                    BoxName: "jhbjhb",
                    Length: 1,
                    Weight: 3,
                    Height: 5,
                    Gross: 4,
                    NetWeight: 2,
                    Count: 0,
                    LPickLabelNum: "PL_CKD_2W_ZAH_03_25OCT202400001",
                    LPRLevelNum: "PR_CKD_2W_ZAH_01_25OCT202400035",
                    LSLLevelNum: "SL_CKD_2W_ZAH_01_25OCT202400001",
                    LTRLevelNum: "BOX_CKD_2W_ZAH_01_25OCT202400001",
                    LTRLNUM_LOT: "BOX_CKD_2W_ZAH_01_25OCT202400001$DAA 24 07 00 0111",
                    LPRLevelCount: null,
                    LSLLevelCount: 1,
                    LTRLevelCount: 1,
                    LabelType: "Single",
                    PartNo: "25270101030770",
                    PartDesc: "ENGINE ASSY_IPBT",
                    Validity: 1,
                    LotQty: 2,
                    AvailableQty: 0,
                    LotNumber: "DAA 24 07 00 0111",
                    REVANDSEQ: "G 2",
                    StoreLoc: "Sachin Pednekar",
                    Buyer: null,
                    BinLoc: null,
                    CTQ: "AGGREGATE",
                    PickLabelType: "INDIVIDUAL",
                    PartLabelType: null,
                    PkgStrategy: 0,
                    SplitQty: 0,
                    Carton: 0,
                    PairNo: 0,
                    UnitWeight: "K10",
                    TotalWeight: null,
                    MRP: "OOR",
                    VendorName: 0,
                    GPart: 1,
                    GroupNumber: null,
                    IsPrimaryScanned: null,
                    IsSecondaryScanned: null,
                    Field1: null,
                    Field2: null,
                    Field3: null,
                    Field4: null,
                    Field5: null,
                    Field6: null,
                    Field7: null,
                    Field8: null,
                    Field9: null,
                    Field10: null,
                    NField1: null,
                    NField2: null,
                    NField3: null,
                    NField4: null,
                    NField5: null,
                    DField1: null,
                    DField2: null,
                    DField3: null,
                    DField4: null,
                    DField5: null,
                    MTLStatus: 102,
                    MTLStatusName: "Received",
                    PLPrintStatus: 101,
                    PLPrintStatusName: "Pending",
                    PRPrintStatus: 103,
                    PRPrintStatusName: "Printed",
                    PRPrintDate: "06:03.9",
                    SLPrintStatus: 103,
                    SLPrintStatusName: "Printed",
                    SLPrintDate: "24:48.3",
                    TRLPrintStatus: 103,
                    TRLPrintStatusName: "Printed",
                    TRLPrintDate: "02:49.8",
                    UserId: 8504222,
                    IsScannedViaWeb: 1,
                    CreatedBy: 8504432,
                    CreatedDate: "06:03.9",
                    UpdatedBy: null,
                    UpdatedDate: null
                }
                  
            ]
        } ;

        let filteredData;
        
        if (LevelType === 'Primary') {
            filteredData = encrypt({ data: successMessage.PRHeaders });
            res.status(200).json({ data: filteredData });
        } else if (LevelType === 'Secondary') {
            filteredData = encrypt({ data: successMessage.SLHeaders });
            res.status(200).json({ data: filteredData });
        } else if (LevelType === 'Tertiary') {
            filteredData = encrypt({ data: successMessage.TRHeaders });
            res.status(200).json({ data: filteredData });
        } else {
            filteredData = `Invalid Level Type ${LevelType}`;
        }

      
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { printData, encrypt, decrypt };
