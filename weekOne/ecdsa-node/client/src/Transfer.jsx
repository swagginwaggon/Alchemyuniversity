import { useState } from 'react';
import Sign from './Sign';
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const handleInputChange = (setter) => (evt) => setter(evt.target.value);

  const initiateTransfer = () => setIsSigning(true);

  const handleSign = async (signature, message) => {
    setIsSigning(false);
    try {
      const { data: { balance } } = await server.post("send", {
        sender: address,
        amount: parseInt(sendAmount, 10),
        recipient,
        signature,
        message
      });
      setBalance(balance);
    } catch (ex) {
      console.error('Transfer error:', ex);
      alert(ex.response?.data?.message || 'Error during transaction');
    }
  };

  return (
    <div>
      {!isSigning ? (
        <div className="container transfer">
          <h1>Send Transaction</h1>
          <input placeholder="Amount" value={sendAmount} onChange={handleInputChange(setSendAmount)} />
          <input placeholder="Recipient Address" value={recipient} onChange={handleInputChange(setRecipient)} />
          <button onClick={initiateTransfer} className="button">Transfer</button>
        </div>
      ) : (
        <Sign sender={address} amount={sendAmount} recipient={recipient} onSign={handleSign} />
      )}
    </div>
  );
}

export default Transfer;