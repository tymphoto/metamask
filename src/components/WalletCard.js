import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SendForm from './SendForm';
import Transactions from './Transactions';

function WalletCard() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  // Асинхронный запрос баланса кошелька
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

  // Метод для получения аккаунта из localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wallet'));
    if (saved) {
      setDefaultAccount(saved);
      setConnButtonText('Wallet Connected');
      getAccountBalance(saved[0]);
    }
  }, []);

  // Запись аккаунта в localStorage
  useEffect(() => {
    localStorage.setItem('wallet', JSON.stringify(defaultAccount));
  }, [defaultAccount]);

  // Функция для изменения состояний аккаунта и баланса
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  // Ассинронный запрос аккаунта из MetaMask
  async function connectWalletHandler() {
    if (window.ethereum && window.ethereum.isMetaMask) { // если метамаск подключен
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
    } else { // если нет такого плагина, предложение его установить
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  }

  // Ф-я перезагрузки страницы при смене аккаунта для сброса состояний
  const chainChangedHandler = () => {
    window.location.reload();
  };

  // Методы следящие за изменением аккаунта и сети
  window.ethereum.on('accountsChanged', connectWalletHandler);
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
          <div>
            <div className="connect_container">
              <SendForm />

            </div>
            <Transactions address={defaultAccount} />
          </div>
        )
        : ''}
    </div>
  );
}

export default WalletCard;
