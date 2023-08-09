import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Logout Component
const Logout = ({ username }) => {
  
    // Function to handle the logout action
    const handleLogout = () => {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          };      
        // Sending POST request to the logout endpoint with username
        axios.post('http://localhost:3001/logout/all', { username: username }, config )
        .then((response) => {
            // Checking the response status
            if (response.status === 200) {
                console.log('Logged out from all sessions');
            } else {
                console.log('Logout failed');
            }
        })
        .catch((error) => {
            // Catching and logging any errors
            console.error('Error:', error);
        });
    };

    // Component UI with Logout link
    return (
    <div class="d-flex justify-content-end">
        <Link to="/login" className="btn btn-danger" onClick={handleLogout}>
            Logout
        </Link>
    </div>
    );
};

// Exporting the Logout Component
export default Logout;
