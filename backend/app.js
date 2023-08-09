const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

const userController = require('./controllers/userController');

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/login', userController.login);
app.use('/logout/all', userController.logoutAll);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
