import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Homepage from './components/Homepage';

function App() {
  const [account, setAccount] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('testament-view');

  const handleLogin = (account) => {
    // For demonstration purposes only
    if (account) {
      setAccount(account)
      setIsLoggedIn(true);
      setCurrentPage('testament-view');
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  return (
    <div className="App">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
      </head>
      <header className="header">
        <h1>Testament Manager</h1>
        {isLoggedIn && <p className='logout-btn' onClick={handleLogout}>Logout</p>}
      </header>
      {isLoggedIn ? (
        <Homepage account = {account}/>  
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
