import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

// Login Component
const Login = () => {
    // Using useState to manage username and password variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Accessing history object for redirecting 
    let history = useHistory();

    // Hide the error or success message
    useEffect(() => {
        if (errorMessage || successMessage) {
          const timer = setTimeout(() => {
            setErrorMessage(null);
            setSuccessMessage(null);
          }, 2000); // hide the message after 2 seconds
          return () => clearTimeout(timer); // Clear the timeout if the component is unmounted
        }
      }, [errorMessage, successMessage]);
    
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Manual validation
        if (!username || !password) {
            setErrorMessage('All fields are required!');
            return;
        }
        try {
            // Sending POST request to the login endpoint
            const res = await axios.post('http://localhost:3001/login', { username, password }); 
            // If response contains a token, storing it and redirecting to '/product'.
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setSuccessMessage('Login successful! Redirecting...');
                history.push({
                    pathname: '/product',
                    state: { username, deposit: res.data.deposit, sellerID: res.data.sellerID, buyerID: res.data.buyerID }
                });
             }
            // Resetting form fields
            setUsername(''); 
            setPassword('');
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    // Component UI
    return (
        <div className="container">
            <h2 className="row justify-content-center">Login</h2>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                        <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="d-grid gap-2">
                        <button onClick={handleSubmit} className="btn btn-info">Login</button>
                        <Link className="btn btn-secondary" to="/">Create a User</Link>
                    </div>
                </div>
            </div>
            <br/>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
        </div>
    );
};

// Exporting the Login Component
export default Login;
