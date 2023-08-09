const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'YOUR_SECRET_KEY';

let users = {};
let activeTokens = [];
let currentSellerID = 1;
let currentProductID = 1;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const validatePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

function generateSellerID() {
  const sellerID = `seller${currentSellerID}`;
  currentSellerID++;
  return sellerID;
}

function generateProductID() {
  const productID = `buyer${currentProductID}`;
  currentProductID++;
  return productID;
}

exports.createUser = async (req, res) => {
    const { username, password, deposit, role } = req.body;
    if (users[username]) {
        return res.status(400).send('User already exists');
    }
    const hashedPassword = await hashPassword(password);
    let sellerID, buyerID;
    switch (role) {
        case 'seller':
            sellerID = generateSellerID();
            buyerID = null;
            break;
        case 'buyer':
            buyerID = generateProductID();
            sellerID = null;
            break;
        default:
            return res.status(400).send('Invalid role');
    }
    users[username] = { password: hashedPassword, deposit, role, sellerID, buyerID };
    return res.status(201).send('User created successfully');
};

exports.updateUser = async (req, res) => {
    const username = req.params.username;
    const user = users[username];
    if (!user) {
        return res.status(404).send('User not found');
    }
    const { deposit } = req.body;
    users[username] = { ...user, deposit };
    return res.status(200).send('User updated successfully');
};

exports.deleteUser = (req, res) => {
    const username = req.params.username;
    const user = users[username];
    if (!user) {
        return res.status(404).send('User not found');
    }
    delete users[username];
    return res.status(200).send('User deleted successfully');
};

exports.getUser = (req, res) => {
    const username = req.params.username;
    const user = users[username];
    if (!user) {
        return res.status(404).send('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
};

exports.getAllUsers = (req, res) => {
    const usersWithoutPasswords = Object.entries(users).reduce((acc, [username, user]) => {
        const { password, ...userWithoutPassword } = user;
        acc[username] = userWithoutPassword;
        return acc;
    }, {});
    return res.status(200).json(usersWithoutPasswords);
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (activeTokens.find(token => token.username === username)) {
        return res.status(400).send('There is already an active session using your account');
    }
    const user = users[username];
    if (!user) {
        return res.status(400).send('User not found');
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({
        username,
        sellerID: user.sellerID,
        buyerID: user.buyerID,
    }, SECRET_KEY, { expiresIn: '1h' });
    activeTokens.push({ username, token });
    return res.status(200).json({
        message: 'Logged in successfully',
        token,
        sellerID: user.sellerID,
        buyerID: user.buyerID,
        deposit: user.deposit
    });
};

exports.logoutAll = (req, res) => {
    const { username } = req.body;
    activeTokens = activeTokens.filter(token => token.username !== username);
    return res.status(200).send('All sessions have been logged out');
};
