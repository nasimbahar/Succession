// import React, { useState } from "react";
// import { useNavigate  } from "react-router-dom";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate ();

//   async function handleLogin(event) {
//     event.preventDefault();
//     console.log("LOGING IN");
//     let account;
//     if(window.ethereum !== "undefined"){
//         const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
//         account = accounts[0];
//         console.log(accounts);
//     }
//     navigate('/viewTestament');
//   }


//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <label>
//           Username:
//           <input
//             type="text"
//             value={username}
//             onChange={(event) => setUsername(event.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input
//             type="password"
//             value={password}
//             onChange={(event) => setPassword(event.target.value)}
//           />
//         </label>
//         <br />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p>{error}</p>}
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";

import './styles/Login.css';

const Login = ({ onLogin }) => {

    async function handleLogin(event) {
    event.preventDefault();
    console.log("LOGING IN");
    let account;
    if(window.ethereum !== "undefined"){
        const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
        account = accounts[0];
        console.log(accounts);
        onLogin(account)
    }
  }


  return (
    <div className="containerDiv">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
      </head>
      <div className = "welcomeText"><p>Welcome to our online Testament Management System! This app allows you to easily create and manage your Last Will and Testament, ensuring your wishes are carried out after you're gone. With our user-friendly interface, you can quickly create a customized testament that reflects your unique needs and preferences. Don't leave the distribution of your assets and possessions up to chance, create your testament with us today! Please log in below to get started.</p></div>
      <div className="contentDiv">
        <button className="loginBtn" onClick={handleLogin}>Login with Metamask</button>
      </div>
    </div>
  );
};

export default Login;