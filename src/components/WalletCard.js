import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SendForm from './SendForm';

function WalletCard() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  async function getAccountBalance(account) {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });
      setUserBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wallet'));
    if (saved) {
      setDefaultAccount(saved);
      setConnButtonText('Wallet Connected');
      getAccountBalance(saved[0]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wallet', JSON.stringify(defaultAccount));
  }, [defaultAccount]);

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  async function connectWalletHandler() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const account = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        accountChangedHandler(account);
        setConnButtonText('Wallet Connected');
        getAccountBalance(account[0]);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  }

  // Перезагрузить страницу при смене аккаунта
  const chainChangedHandler = () => {
    window.location.reload();
  };

  // Слушатель изменения аккаунта
  window.ethereum.on('accountsChanged', accountChangedHandler);
  window.ethereum.on('chainChanged', chainChangedHandler);

  return (
    <div>
      <div className="connect_container">
        <button className="conButton" type="button" onClick={connectWalletHandler}>{connButtonText}</button>
        {defaultAccount
          ? (
            <div className="account_display">
              <h3>
                Address:
                {defaultAccount}
              </h3>
              <h3>
                Balance:
                {userBalance}
              </h3>
            </div>
          )
          : ''}
        {errorMessage}
      </div>
      {defaultAccount
        ? (
          <div className="connect_container">
            <SendForm />
          </div>
        )
        : ''}

    </div>
  );
}

export default WalletCard;
