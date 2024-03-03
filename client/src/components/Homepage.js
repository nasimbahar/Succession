import Web3 from 'web3';
import {useState, useEffect} from 'react'
import Testament from '../contracts/TestamentManager.json'
import TestamentForm from './TestamentForm';
import TestamentView from './TestamentView';
import HospitalPage from './Hospital';
import React from "react";

const loadTestamentData = async (contract) => {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  const data = await contract.methods.getTestament().call({ 'from': account });
  return data;
};

function Homepage({account}) {
  const hospitalAddress = "0xCded5607C0cBD892BDdef4817c8Bc0C1505C67F1"
  const [state, setState] = useState(null);
  const [recipients, setRecipients] = useState(null);
  const [percentages, setPercentages] = useState(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
      if (provider) {
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Testament.networks[networkId];
        const contract = new web3.eth.Contract(Testament.abi, deployedNetwork.address);
        setState({web3, contract, provider});
      }
      
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (state) {
      console.log(state);
      loadTestamentData(state.contract).then(data => {
        setRecipients(data[1]);
        setPercentages(data[2]);
        setValue(data[0]/1000000000000000000);
      });
    }
  }, [state]);

  console.log(account);

  return (
    <div>
      {account.toLowerCase() === hospitalAddress.toLowerCase() ? (
        <HospitalPage state={state} recipients={recipients} percentages={percentages} value={value} account = {account}/> // Display HospitalPage for hospital account
      ) : (
        <>
          {recipients && percentages && value ? (
            <TestamentView state={state} recipients={recipients} percentages={percentages} value={value} account = {account}/>
          ) : (
            <TestamentForm account = {account}/>
          )}
        </>
      )}
    </div>
  );

  }

export default Homepage;