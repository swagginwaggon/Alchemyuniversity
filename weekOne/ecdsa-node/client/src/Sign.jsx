// Sign.js
import { useState } from 'react';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from "ethereum-cryptography/keccak";

function Sign({ sender, amount, recipient, onSign }) {
  const [privateKey, setPrivateKey] = useState('');

  const handleSign = () => {
    const message = `Transfer ${amount} ETH from ${sender} to ${recipient}`;
    const messageHash = keccak256(utf8ToBytes(message));
    const signatureObject = secp256k1.sign(messageHash, privateKey);

    // Convert BigInts to strings for serialization
    const signature = {
      r: signatureObject.r.toString(16),
      s: signatureObject.s.toString(16),
      recovery: signatureObject.recovery
    };

    onSign(signature, message);
  };

  return (
    <div>
      <input
        type="text"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Enter sender private key"
      />
      <button onClick={handleSign}>Sign Transaction</button>
    </div>
  );
}

export default Sign;
