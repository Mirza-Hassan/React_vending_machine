import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

// Register Component
const Register = () => {
    
    // Using useState to manage username, password, deposit, and role variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [deposit, setDeposit] = useState('');
    const [role, setRole] = useState('');
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
          return () => clearTimeout(timer);
        }
      }, [errorMessage, successMessage]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Manual validation
        if (!username || !password || !deposit || !role) {
            // You might show some user-friendly error message here
            setErrorMessage('All fields are required!');
            return;
        }
        try {
            // Sending POST request to the user endpoint with username, password, deposit and role
            const res = await axios.post('http://localhost:3001/user', { username, password, deposit, role }); 
            // If the server response contains data, redirecting to '/product'.
            if (res.data) {
                setSuccessMessage('User successfully created!');
                history.push({
                    pathname: '/product',
                    state: { username, deposit, role }
                });
             }                         
            // Resetting form fields
            setUsername('');
            setPassword('');
            setDeposit('');
            setRole('');
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Error creating user!');
        }
    };

    // Component UI
    return (
        <div className="container">
        <h2 className="row justify-content-center">Registration</h2>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                        <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="deposit" className="form-label">Deposit <span className="text-danger">*</span></label>
                        <input type="number" className="form-control" id="deposit" placeholder="Deposit" value={deposit} onChange={(e) => setDeposit(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role <span className="text-danger">*</span></label>
                        <select id="role" className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Select Role</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    <div className="d-grid gap-2">
                        <button onClick={handleSubmit} className="btn btn-info">Create User</button>
                        <Link className="btn btn-secondary" to="/login">Back to Login</Link>
                    </div>
                </div>
            </div>
            <br/>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        </div>
    );
};

// Exporting the Register Component
export default Register;
