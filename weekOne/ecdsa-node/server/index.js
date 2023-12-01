const express = require("express");
const cors = require("cors");
const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const app = express();
const port = 3042;

// Middleware
app.use(cors());
app.use(express.json());

// Sample balances using public keys as keys
const balances = {
  "03f2a09da37f92191148129f9ec68bb2b9318fee52cb3c7f6f4dca1267036163f0": 100,
  "0388906a714fa9d6204d1b9f63c04068f0431c4d1a0b315a71f38ad483f3b9bf95": 50,
  "024aa6853e3f4cbb28857a5f9c057a3a753b8a9e9d97127f662f76dcce81611118": 75,
};

// Helper function to set initial balance if address is not in the balances object
function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

// Route to get balance of an address
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, message } = req.body;

  const messageHash = keccak256(utf8ToBytes(message));

  // Convert the sender address (public key) to Uint8Array
  const senderPublicKey = Uint8Array.from(Buffer.from(sender, 'hex'));

  // Convert BigInt signature components to Uint8Array
  const r = Buffer.from(signature.r.padStart(64, '0'), 'hex');
  const s = Buffer.from(signature.s.padStart(64, '0'), 'hex');

  // Reconstruct the signature for verification
  const signatureBuffer = Buffer.concat([r, s]);

  // Verify the signature
  const isValidSignature = secp256k1.verify(
    signatureBuffer, 
    messageHash, 
    senderPublicKey
  );

  if (!isValidSignature) {
    return res.status(401).send({ message: "Invalid signature" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!balances[sender] || balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    return res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
