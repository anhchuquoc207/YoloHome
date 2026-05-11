"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.signAuthToken = signAuthToken;
exports.verifyAuthToken = verifyAuthToken;
const crypto_1 = require("crypto");
function encodeBase64Url(input) {
    return Buffer.from(input).toString('base64url');
}
function decodeBase64Url(input) {
    return Buffer.from(input, 'base64url').toString('utf8');
}
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const derived = (0, crypto_1.scryptSync)(password, salt, 64).toString('hex');
    return `${salt}:${derived}`;
}
function verifyPassword(password, hashedPassword) {
    const [salt, storedHash] = hashedPassword.split(':');
    if (!salt || !storedHash)
        return false;
    const derived = (0, crypto_1.scryptSync)(password, salt, 64);
    const stored = Buffer.from(storedHash, 'hex');
    if (derived.length !== stored.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(derived, stored);
}
function signAuthToken(payload, secret, ttlSeconds) {
    const fullPayload = {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    };
    const encodedPayload = encodeBase64Url(JSON.stringify(fullPayload));
    const signature = (0, crypto_1.createHmac)('sha256', secret).update(encodedPayload).digest('base64url');
    return `${encodedPayload}.${signature}`;
}
function verifyAuthToken(token, secret) {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature)
        return null;
    const expectedSignature = (0, crypto_1.createHmac)('sha256', secret)
        .update(encodedPayload)
        .digest('base64url');
    if (signature !== expectedSignature)
        return null;
    try {
        const payload = JSON.parse(decodeBase64Url(encodedPayload));
        if (payload.exp <= Math.floor(Date.now() / 1000))
            return null;
        return payload;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=auth.utils.js.map