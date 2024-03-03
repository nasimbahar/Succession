import React, { useState, useEffect } from 'react';

import './styles/TestamentView.css';
import Homepage from './Homepage';

function TestamentView({ state, recipients, percentages, value, account }) {
  const [contractExists, setContractExists] = useState(true);


  async function handleDistribute(contract) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    console.log(contract);
    const result = await contract.methods.distribute(account).send({ from: account, gas: 3000000 })
    .then((reciept) => {
      console.log("reciept:", reciept);
      setContractExists(false)
    })
    .catch((error) => {
      console.log("error:", error)
    })
  }

  async function handleCancel(contract) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    console.log(contract);
    const result = await contract.methods.cancelTestamnet(account).send({ from: account, gas: 3000000 })
    .then((reciept) => {
      console.log("reciept:", reciept);
      setContractExists(false)
    })
    .catch((error) => {
      console.log("error:", error)
    })
  }

  const totalPercentage = percentages.reduce((acc, cur) => acc + cur, 0);

  console.log(recipients, percentages, value)
  return (
    <>
      {contractExists ? (
        <div className='viewTestament'>
          <div className="testament-container">
            <div className="testament-header">
              My testament
            </div>
            <div className="testament-value">{value} ETH</div>
            <div className="testament-content">
              <table className="testament-table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Percentage</th>
                    <th>Inherited Value</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.map((recipient, index) => (
                    <tr className="testament-row" key={recipient}>
                      <td>{recipient}</td>
                      <td>{percentages[index]}%</td>
                      <td>{(value * (percentages[index] / 100)).toFixed(2)} ETH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="distributeBtn" onClick={() => handleDistribute(state.contract)}>
                Distribute
              </button>
              <button className="cancelBtn" onClick={() => handleCancel(state.contract)}>
                Cancel Testament
              </button>
          </div>
        </div>
      ) : (
        <Homepage account = {account}/>
      )}
    </>
  );
}

export default TestamentView;