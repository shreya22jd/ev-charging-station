const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '../keys/private_key.pem'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../keys/public_key.pem'), 'utf8');

// Sign the payload
const signPayload = (payload) => {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(JSON.stringify(payload));
    sign.end();
    return sign.sign(privateKey, 'base64');
};

// Verify the payload
const verifyPayload = (payload, signature) => {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(JSON.stringify(payload));
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
};

module.exports = {
    signPayload,
    verifyPayload
};
