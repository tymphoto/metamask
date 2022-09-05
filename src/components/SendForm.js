import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ethers } from 'ethers';

function SendForm() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [address, setAddress] = useState('');
  const [sum, setSum] = useState(0);

  console.log('test ssh')

  // Изменение состояния инпута с адресом отправки
  const changeAddresHandler = (event) => {
    setAddress(event.target.value);
  };

  // Изменение состояния инпута с суммой отправки
  const changeSumHandler = (event) => {
    setSum(event.target.value);
  };

  // Ф-я для оссуществления транзакции
  const startPayment = async (e, summ, addr) => {
    e.preventDefault();
    try {
      // создание провайдера из библиотеки ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: ethers.utils.getAddress(addr), // проверка валидности адреса
        value: ethers.utils.parseEther(summ), // проверка валидности суммы
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Form>
      <h3>Send form</h3>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Address"
          onChange={(e) => changeAddresHandler(e)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Sum</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Sum"
          onChange={(e) => changeSumHandler(e)}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        onClick={(e) => startPayment(e, sum, address)}
      >
        Submit
      </Button>
      <div className="errorMessage">
        {errorMessage === 'invalid address (argument="address", value="test", code=INVALID_ARGUMENT, version=address/5.6.1)' ? 'Not valid adress' : ''}
        {errorMessage === 'invalid decimal value (argument="value", value="test", code=INVALID_ARGUMENT, version=bignumber/5.6.2)' ? 'Not valid sum' : ''}
        {errorMessage === 'Internal JSON-RPC error.' ? 'You have not enougth money' : ''}
      </div>

    </Form>
  );
}

export default SendForm;
