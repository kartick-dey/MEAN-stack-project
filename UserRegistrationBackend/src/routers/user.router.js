const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');

const {createUser, activateAccount, loginWithJwtToken, getAllUsers, getEmail} = require('../modules/user/user.controller');

// Creating create user route
router.post('/create', createUser);
router.post('/confirmemail', activateAccount);
router.post('/login', loginWithJwtToken);
// Adding verification token middleware to protect this route
router.get('/get-users', verifyToken, getAllUsers);
router.get('/get-email/:email', getEmail);

module.exports = router
