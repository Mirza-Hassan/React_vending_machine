const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.put('/:username', userController.updateUser);
router.delete('/:username', userController.deleteUser);
router.get('/:username', userController.getUser);
router.get('/', userController.getAllUsers);

module.exports = router;
