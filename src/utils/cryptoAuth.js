/**
 * Security and Cryptographic Utilities for Optimum Platform
 * - PBKDF2 with SHA-256 (100,000 iterations) using standard Web Crypto API (SubtleCrypto)
 * - Cryptographically secure random salt & invitation code generator
 * - Constant-time comparison to prevent timing attacks
 */

// Generate cryptographically secure random hex salt
export function generateSalt(byteLength = 16) {
    const array = new Uint8Array(byteLength);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Generate unpredictable, secure alphanumeric Group Invitation Code (e.g. OPT-8F2K9)
export function generateInviteCode(prefix = 'OPT') {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous 0, 1, I, O
    const array = new Uint8Array(5);
    window.crypto.getRandomValues(array);
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars[array[i] % chars.length];
    }
    return `${prefix}-${code}`;
}

// Convert string to ArrayBuffer
function stringToBuffer(str) {
    return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to Hex String
function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a password using standard PBKDF2-HMAC-SHA256 (100,000 iterations)
 * Returns { hash, salt, iterations: 100000, algorithm: 'PBKDF2-SHA256' }
 */
export async function hashPassword(plainPassword, salt = null) {
    if (!salt) {
        salt = generateSalt(16);
    }

    const passwordBuffer = stringToBuffer(plainPassword);
    const saltBuffer = stringToBuffer(salt);

    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256 // 32 bytes
    );

    const hashHex = bufferToHex(derivedBits);

    return {
        hash: hashHex,
        salt,
        iterations: 100000,
        algo: 'PBKDF2-SHA256'
    };
}

/**
 * Verify a plain password against stored hash & salt
 * Constant-time byte comparison
 */
export async function verifyPassword(plainPassword, storedHash, storedSalt) {
    if (!plainPassword || !storedHash || !storedSalt) return false;
    const computed = await hashPassword(plainPassword, storedSalt);
    
    // Constant-time check
    if (computed.hash.length !== storedHash.length) return false;
    let diff = 0;
    for (let i = 0; i < computed.hash.length; i++) {
        diff |= computed.hash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return diff === 0;
}

/**
 * Generate Secure Session Token
 */
export function generateSessionToken() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}
