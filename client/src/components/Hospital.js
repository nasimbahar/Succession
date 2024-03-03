import React from "react";

import './styles/Hospital.css';

const HospitalPage = ({ state, recipients, percentages, value, account }) => {

    async function handleDemise(contract) {
        const addressInput = document.querySelector('.addressInput');
        const address = addressInput.value;
        console.log(address);
        const result = await state.contract.methods.distribute(address).send({ from: account, gas: 3000000 })
        .then((reciept) => {
          console.log("reciept:", reciept);
        })
        .catch((error) => {
          console.log("error:", error)
        })
    }

  return (
    <div className="containerDiv">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
      </head>
      <div className="demiseDiv">
        <input className="addressInput" placeholder="Address of the deceased"></input>
        <button className="demiseBtn" onClick={handleDemise}>Register demise</button>
      </div>
    </div>
  );
};

export default HospitalPage;