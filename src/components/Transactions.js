import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

function Transactions({ address }) {
  const [transactionsList, setTranstactionsList] = useState(null);

  // Запрос на получение транзакций по акканту
  async function getAllTransactions(addr) {
    try {
      const response = await fetch(`https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=6MTZRJ8E5GHZM8TPMJIDWI4ZQQ7M58AWJE`);
      const data = await response.json();
      setTranstactionsList(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="connect_container">
      <Button
        className="mb-1"
        type="button"
        variant="primary"
        onClick={() => getAllTransactions(address)}
      >
        Get Transactions
      </Button>
      {transactionsList
        ? (
          <div>
            {transactionsList?.result?.map((item) => {
              const link = 'https://mumbai.polygonscan.com/tx/';

              return (
                <li key={item.blockNumber}><a href={link + item.hash} target="_blank" rel="noreferrer">{item.blockNumber}</a></li>
              );
            })}
          </div>
        )
        : ''}

    </div>
  );
}

export default Transactions;
