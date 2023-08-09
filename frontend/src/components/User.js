import React, { useState, useEffect } from 'react';
import axios from 'axios';

// User Component
function User({ username, userDetail }) {

  // State variables to manage user details and editing
  const [usersList, setUsersList] = useState([]);
  const [editedDeposit, setEditedDeposit] = useState('');
  const [editedUser, setEditedUser] = useState(null);
  const [validationMessage, setValidationMessage] = useState(null);

   // Fetch user details and all users on component mount
  useEffect(() => {
    // fetchUsers();
    fetchAllUsers();
  }, []);

  // Hide the error or success message
  useEffect(() => {
    if (validationMessage) {
      const timer = setTimeout(() => {
        setValidationMessage(null);
      }, 2000); // hide the message after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [validationMessage]);

  // Fetch all users from the API
  const fetchAllUsers = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    try {
      const response = await axios.get('http://localhost:3001/user', config);
      setUsersList(Object.entries(response?.data).map(([username, user]) => ({ ...user, username })));
    } catch (error) {
      console.log(error); // Handle error (e.g., failed API request)
    }
  };

  // Set the user to be edited and initialize editedDeposit state
  const handleEdit = (editedUsername) => {
    setEditedUser(editedUsername);
    const userToEdit = usersList.find((user) => user.username === editedUsername);
    if (userToEdit) {
      setEditedDeposit(userToEdit.deposit);
    }
  };

  // Clear the user being edited by setting editedUser to null
  const handleCancel = () => {
    setEditedUser(null);
  };

  // Save the edited user details to the server and refresh user list
  const handleSave = async (editedUsername) => {
    // Manual validation
    if (!editedDeposit) {
      // You might show some user-friendly error message here
      setValidationMessage('Deposit field is required!');
      return;
    }    
    try {
      const updatedUser = usersList.find((user) => user.username === editedUsername);
      if (!updatedUser) {
        return; // User not found in the list
      }
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };      
      const updatedUserDetail = { ...updatedUser, deposit: editedDeposit };
      await axios.put( `http://localhost:3001/user/${editedUsername}`, updatedUserDetail, config );
      setEditedUser(null);
      await fetchAllUsers(); // Refresh user list after saving
      setValidationMessage('User details successfully updated!');
    } catch (error) {
      setValidationMessage('Error updating user details!');
      console.log(error); // Handle error (e.g., failed API request)
    }
  };
  
  // Delete the user from the server and refresh user list
  const handleDelete = async (username) => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };      
    try {
      await axios.delete(`http://localhost:3001/user/${username}`, config);
      await fetchAllUsers(); // Refresh user list after deletion
      setValidationMessage('User successfully deleted!');
    } catch (error) {
      setValidationMessage('Error deleting user!');
      console.log(error); // Handle error (e.g., failed API request)
    }
  };

  // User Component UI  
  return (
    <div className="App">

        <div className="container mt-4">
            <div className="border p-4">
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Role:</strong> {userDetail.role}</p>
              <p><strong>Deposit:</strong> {userDetail.deposit}</p>
              {userDetail.role === 'buyer' ? (
                <p><strong>BuyerID:</strong> {userDetail.buyerID ? userDetail.buyerID : '-'}</p>
              ) : (
                <p><strong>SellerID:</strong> {userDetail.sellerID ? userDetail.sellerID : '-'}</p>
              )}
            </div>
        </div>

        <div className="container mt-5">
          <h1>User Details</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Deposit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {usersList
              .filter((user) => user.username !== username) // Filter out the logged-in user
              .length > 0 ? (
              usersList
                .filter((user) => user.username !== username)
                .map((user) => (
                  <tr key={user.username}>
                    <td>{editedUser === user.username ? (
                      <input type="text" className="form-control" placeholder={user.username} disabled />
                    ) : user.username}</td>
                    <td>{user.role}</td>
                    <td>{editedUser === user.username ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editedDeposit}
                        onChange={(e) => setEditedDeposit(e.target.value)}
                        required
                      />
                    ) : user.deposit}</td>
                    <td>
                      {editedUser === user.username ? (
                        <>
                          <button className="btn btn-success mr-2" onClick={() => handleSave(user.username)}>Save</button>
                          {'  '}
                          <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary mr-2" onClick={() => handleEdit(user.username)}>Edit</button>
                          {'  '}
                          <button className="btn btn-danger" onClick={() => handleDelete(user.username)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>            
                ))
            ) : (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
              )}
            </tbody>
            </table>
        </div>

        {validationMessage && <div className="alert alert-info">{validationMessage}</div>}

    </div>
  );
}

// Exporting the User Component
export default User;
