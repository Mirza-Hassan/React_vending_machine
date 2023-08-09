import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Vendor Component
function Vendor({deposit, buyerID}) {

  // State management for purchases, coin, productId, amount, depositInput, and products
  const [purchases, setPurchases] = useState([]);
  const [coin, setCoin] = useState(5);
  const [productId, setProductId] = useState(1);
  const [amount, setAmount] = useState(1);
  const [depositInput, setDepositInput] = useState(deposit);
  const [products, setProducts] = useState([]);
  const [remainingDeposit, setRemainingDeposit] = useState(deposit);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // useEffect hook to fetch products data when the component mounts
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios.get('http://localhost:3001/product', config).then(response => {
        setProducts(response?.data);
        const firstProductId = Object.keys(response?.data)[0];
        if (firstProductId) {
          setProductId(firstProductId);
          setAmount(response?.data[firstProductId].amountAvailable);
        }
      });
  }, []);

  // Hide the error or success message
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 2000); // 2 seconds
  
      return () => clearTimeout(timer); // Clear the timer if the component is unmounted
    }
  }, [successMessage, errorMessage]);
  
  // Function to handle coin deposit
  const depositCoin = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      const response = await axios.post('http://localhost:3001/product/deposit', { coin, deposit }, config);
      // Add the value of the deposited coins to the remaining deposit
      const newRemainingDeposit = Number(remainingDeposit) + parseInt(coin);

      setDepositInput(response.data.deposit);
      setRemainingDeposit(newRemainingDeposit); // Update the remaining deposit value in state

      setSuccessMessage('Coin deposited successfully.');
    } catch (error) {
      setErrorMessage('Failed to deposit coin.');
    }
  };

  // Function to handle product purchase
  const buyProduct = async () => {
    try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        };
        const response = await axios.post('http://localhost:3001/product/buy', { productId, amount, buyerID, deposit: remainingDeposit }, config);
        // Get the cost of the purchased product
        const productCost = products[productId].cost;

        // Calculate the total cost of this purchase
        const thisPurchaseTotal = productCost * amount;

        // Set the purchases state directly from the response
        setPurchases({
          ...response.data,
          totalSpent: thisPurchaseTotal,
        });

        // Subtract the total spent from the deposit
      const newRemainingDeposit = remainingDeposit - thisPurchaseTotal;
      setRemainingDeposit(newRemainingDeposit);

      setSuccessMessage('Product purchased successfully.');
    }  catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // This will set the specific error message sent by the server
      } else {
        setErrorMessage('Failed to purchase product.'); // Generic error if no specific message is provided
      }
    }
  };

  // Function to handle deposit reset
  const resetDeposit = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
        const response = await axios.post('http://localhost:3001/product/reset', config);      
        // Here we reset both depositInput and remainingDeposit
        const newDeposit = response.data.deposit;
        setDepositInput(newDeposit);
        setRemainingDeposit(newDeposit); // Update the remaining deposit value in state
        // setPurchases([]);        
        setSuccessMessage('Deposit reset successfully.');
    } catch (error) {
      setErrorMessage('Failed to reset deposit.');
    }
  };

  // Vendor Component UI
  return (
    <div className="">
      <h1>Vending Machine</h1>
      <p>Deposit: {remainingDeposit} cents</p>
      <div className="mb-3">
        <select className="form-select" value={coin} onChange={e => setCoin(e.target.value)}>
          {[5, 10, 20, 50, 100].map((value) => (
            <option key={value} value={value}>
              {value} cents
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary mb-3" onClick={depositCoin}>Deposit</button> {'  '}
      <button className="btn btn-warning mb-3" onClick={resetDeposit}>Reset deposit</button>
      <br/>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {
        Object.keys(products).length > 0 ? (
          <>
            <div className="mb-3">
              <select className="form-select" value={productId} onChange={e => {
                  setProductId(e.target.value);
                  setAmount(products[e.target.value].amountAvailable);
              }}>
                {Object.entries(products).map(([id, product]) => (
                  <option key={id} value={id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary mb-3" onClick={buyProduct}>Buy product</button>
          </>
        ) : (
          <p>No products available</p>
        )
      }

      {purchases?.totalSpent > 0 && (
        <>
          <h2>Purchases</h2>
          <p>Total Spent: {purchases.totalSpent} cents (Last Product Price)</p>
          <h3>Products Purchased:</h3>
          <ul>
          {purchases.productsPurchased.map((product, i) => {
          return (
            <li key={i}>Product ID: {product.productId}, Amount: {product.amount}</li>
            );
          })}          
        </ul>
        </>
      )}


    </div>
  );
}

// Exporting the Vendor Component
export default Vendor;

