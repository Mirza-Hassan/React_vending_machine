let products = {};
let deposit = 0;
let purchases = [];
let firstTime = true;

exports.createProduct = (req, res) => {
  const { productName, cost, amountAvailable, sellerId } = req.body;
  const productId = Math.random().toString(36).substr(2, 9); // Generate random product ID
  products[productId] = { productName, cost, amountAvailable, sellerId };
  return res.status(201).json({ productId, message: 'Product created successfully' });
};

exports.getProducts = (req, res) => {
  return res.status(200).json(products);
};

exports.updateProduct = (req, res) => {
  const productId = req.params.productId;
  const product = products[productId];
  if (!product) {
    return res.status(404).send('Product not found');
  }
  const { productName, cost, amountAvailable, sellerId } = req.body;
  products[productId] = { productName, cost, amountAvailable, sellerId };
  return res.status(200).send('Product updated successfully');
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.productId;
  const product = products[productId];
  if (!product) {
    return res.status(404).send('Product not found');
  }
  delete products[productId];
  return res.status(200).send('Product deleted successfully');
};

exports.depositFunds = (req, res) => {
  let { coin, deposit: depositInput } = req.body;
  if (firstTime) {
    deposit += Number(depositInput);
    firstTime = false;
  }
  deposit += Number(coin);
  res.json({ deposit });
};

exports.buyProduct = (req, res) => {
  let { productId, amount, buyerID, deposit: userDeposit } = req.body;
  if (!buyerID) {
    return res.status(403).json({ message: 'Only buyers can make purchases.' });
  }
  const product = products[productId];
  if (!product) {
    return res.status(400).json({ message: 'Product not found.' });
  }
  const totalCost = product.cost * amount;
  if (totalCost > userDeposit) {
    return res.status(400).json({ message: 'Insufficient funds.' });
  }
  deposit -= totalCost;
  purchases.push({ productId, amount, totalSpent: totalCost });
  let change = userDeposit - totalCost;
  const coins = [100, 50, 20, 10, 5];
  const changeCoins = [];
  for (const coin of coins) {
    while (change >= coin) {
      changeCoins.push(coin);
      change -= coin;
    }
  }
  res.json({
    totalSpent: totalCost,
    productsPurchased: purchases,
    change: changeCoins,
  });
};

exports.resetDeposit = (req, res) => {
  deposit = 0;
  purchases = []; // Resetting purchases as well if needed
  res.json({ deposit });
};
