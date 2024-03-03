import React from "react";
import { useState, useEffect } from "react";
import Testament from '../contracts/TestamentManager.json'
import Web3 from 'web3';

import "./styles/TestamentForm.css";
import Homepage from "./Homepage";

function TestamentForm({ onSubmit, account}) {
  const [contractExists, setContractExists] = useState(true);
  const [state, setState] = useState({web3:null, contract:null, provider: null})
  const [addresses, setAddresses] = useState([{ address: "", percentage: "" }]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
    async function template(){
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Testament.networks[networkId];
        const contract = new web3.eth.Contract(Testament.abi, deployedNetwork.address);
        console.log(contract);

        setState({web3:web3, contract:contract, provider:provider});
  }
  provider && template();
},[])

  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].address = value;
    setAddresses(newAddresses);
  };

  const handlePercentageChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].percentage = value;
    setAddresses(newAddresses);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { address: "", percentage: "" }]);
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert the percentages to numbers and validate that they sum to 100
    const percentages = addresses.map((address) => parseInt(address.percentage));
    const totalPercentage = percentages.reduce((acc, cur) => acc + cur, 0);
    if (totalPercentage !== 100) {
      setErrorMessage("Percentages must add up to 100.");
      return;
    }

    // Convert the addresses to ENS names if possible
    const promises = addresses.map(async (address) => {
      try {
        const name = await state.provider.lookupAddress(address.address);
        if (name) {
          return name;
        }
      } catch {
        // Ignore errors and return the original address
      }
      return address.address;
    });
    const recipients = await Promise.all(promises);

    const value = document.querySelector('.value-input').value;

    // Submit the form
    const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
    console.log('accounts: ',accounts[0]);
    const totalValue = state.web3.utils.toWei(value, 'ether');

    state.contract.methods.writeTestament(recipients, percentages)
      .send({ value: totalValue, from: accounts[0], gas: 3000000 })
      .then((receipt) => {
        console.log('Transaction receipt:', receipt);
        setContractExists(false)
      })
      .catch((error) => {
        console.error('Transaction error:', error);
      });
    console.log("successs");
    onSubmit({ recipients, percentages });
  };

  return (

    <div className="containterDiv">
      {contractExists ? (
        <form onSubmit={handleSubmit} className="testament-form">
          <div className="address-container">
        {addresses.map((address, index) => (
          <div key={index} className="address-input">
            <label className="address-label">
              Recipient's {index + 1} address   
              <input
                className="address-input"
                type="text"
                value={address.address}
                onChange={(event) => handleAddressChange(index, event.target.value)}
              />
            </label>
            <label className="percentage-label">
              %
              <input
                type="number"
                min="0"
                max="100"
                className="percentage-input"
                value={address.percentage}
                onChange={(event) => handlePercentageChange(index, event.target.value)}
              />
            </label>
            {addresses.length > 1 && (
              <button type="button" onClick={() => handleRemoveAddress(index)} className="remove-address-button">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddAddress} className="add-address-button">
          Add recipient
        </button>
        </div>
        <div className="value-container">
          <div className="input-div">
            <input className="value-input" type="number" placeholder="0.00"/>
            <label className="value-label"> ETH </label>
          </div>
        <button type="submit" className="submit-button">
          Sign Testament
        </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      ) : (
        <Homepage account = {account}/>
      )}
    </div>
  );
}

export default TestamentForm;