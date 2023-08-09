import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Logout from './Logout';
import Machine from './Vendor';
import User from './User';

// Product Component
function Product() {
  // UseLocation is a hook from 'react-router-dom' to access location object properties.
  const location = useLocation();
  const { username, deposit, role, sellerID, buyerID } = location.state || {};

  // Role and IDs related variables
  const isSellerIDExist = role === "seller" || sellerID;
  const isBuyerIDExist = role === "buyer" || buyerID;

  // Using useState to products, Product form and Edit mode variables
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    productId: '',
    productName: '',
    cost: '',
    amountAvailable: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  // Using useState to manage success and error messages
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch products when the component is mounted.
  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  // When productForm changes, the component does nothing here.
  useEffect(() => {
  }, [productForm]);
  
  // Hide success and error messages
  useEffect(() => {
  if (successMessage || errorMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 2000);
    return () => clearTimeout(timer); // Cleanup function
    }
  }, [successMessage, errorMessage]);

  // Handles the action of editing a product.
  const handleEditProduct = (productId) => {
    const productToEdit = products[productId];
    if (productToEdit) {
      setProductForm({
        ...productToEdit,
        productId
      });        
      setIsEditMode(true);
    }
  };
  
  // Fetch specific user details from the API
  const fetchUsers = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    try {
      const response = await axios.get(`http://localhost:3001/user/${username}`, config);
      setUserDetail(response.data);
    } catch (error) {
      console.error(error); // Handle error (e.g., failed API request)
    }
  };
  
  // Fetches the list of products.
  const fetchProducts = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    const res = await axios.get('http://localhost:3001/product', config);
    setProducts(res?.data);
  };

  // Handles the action of creating a product.
  const createProduct = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    try {
      await axios.post('http://localhost:3001/product', {...productForm, sellerId: sellerID}, config);
      fetchProducts();
      setSuccessMessage('Product successfully created!'); // Success message
      setErrorMessage(null); // Clear any previous error messages
    } catch (error) {
      setErrorMessage('Failed to create product. Please try again.'); // Error message
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  // Handles the action of updating a product.
  const updateProduct = async (productForm) => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    try {
      await axios.put(`http://localhost:3001/product/${productForm.productId}`, {...productForm, sellerId: sellerID}, config);
      fetchProducts();
      setSuccessMessage('Product updated successfully.');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to update product.');
    }
  };

  // Handles the action of deleting a product.
  const deleteProduct = async (productId) => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    try {
      await axios.delete(`http://localhost:3001/product/${productId}`, config);
      fetchProducts();
      resetProductForm();
      setIsEditMode(false);
      setSuccessMessage('Product deleted successfully.');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to delete product.');
    }
  };

  // Handles input change in the form.
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

   // Handles form submission.
   const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await updateProduct(productForm); 
    } else {
      await createProduct();
    }
    resetProductForm();
    setIsEditMode(false);
  };
  
  // Reset the form fields and exit edit mode
  const resetProductForm = () => {
    setProductForm({
      productName: '',
      cost: '',
      amountAvailable: '',
    });
  };

  // Determine Seller ID to display
  const displaySellerID = sellerID !== undefined ? sellerID : userDetail.sellerID;
  
  // Product Component UI
  return (
    <div className="container">
      <Logout username={username}/> 
      <h2>Welcome, {username}!</h2>
      <p className="mb-3">{isSellerIDExist ? "You are a seller." : "You are a buyer."}</p>
      <User username={username} userDetail={userDetail}/>
      {isSellerIDExist 
      && (
        <>
        <h2>New Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            name="productName"
            placeholder="Product Name"
            value={productForm.productName}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3"
            name="cost"
            placeholder="Cost"
            value={productForm.cost}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3"
            name="amountAvailable"
            placeholder="Amount Available"
            value={productForm.amountAvailable}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3"
            name="sellerId"
            placeholder="Seller ID"
            value={displaySellerID}
            disabled
          />
          <button className="btn btn-primary" type="submit">{isEditMode ? 'Update Product' : 'Create Product'}</button>
        </form>        
        <br/>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        </>
      )
      }

      {/* Display Products */}
      <h1>Product List</h1>        
      {Object.keys(products).length === 0 ? (
              <p>No products available. Please add some!</p>
        ) : (
        <>
          {Object.keys(products).map((key) => (
          <div key={key} className="mb-3">
              <h3>{products[key].productName}</h3>
              <p>Cost: {products[key].cost}</p>
              <p>Amount Available: {products[key].amountAvailable}</p>
              <p>Seller ID: {products[key].sellerId}</p>
              {
                isSellerIDExist && (
                  <>
                  <button className="btn btn-secondary mr-2" onClick={() => handleEditProduct(key)}>Edit Product</button>
                  {'  '}
                  <button className="btn btn-danger" onClick={() => deleteProduct(key)}>Delete Product</button>
                  </>
                 )
              }
          </div>
          ))}
        </>
      )}

      {/* For buyers, display the vending machine interface */}
      {isBuyerIDExist && (<Machine deposit={deposit} buyerID={userDetail.buyerID}/>)}

    </div>
  );
}

// Exporting the Product Component
export default Product;
