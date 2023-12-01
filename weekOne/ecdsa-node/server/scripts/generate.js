const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

function generateKeyPair() {
    const privateKey = toHex(secp256k1.utils.randomPrivateKey());
    const publicKey = toHex(secp256k1.getPublicKey(privateKey));
    return { privateKey, publicKey };
}

function generateMultipleKeyPairs(count) {
    const keyPairs = [];
    for (let i = 0; i < count; i++) {
        const keyPair = generateKeyPair();
        console.log(`Private key ${i + 1}: `, keyPair.privateKey);
        console.log(`Public key ${i + 1}: `, keyPair.publicKey);
    }
}

// Specify the number of key pairs to generate
const numberOfKeyPairs = 3; // Example: Generate 3 key pairs
generateMultipleKeyPairs(numberOfKeyPairs);
