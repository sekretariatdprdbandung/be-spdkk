// router
const router = require('express').Router();

// controllers
const user = require('../controllers/user');

// middlewares
const { authentication } = require('../middlewares/authentication');

// routes
router.post('/add-user', user.AddUser);
router.get('/get-users', user.getUsers);
router.get('/get-users-role', user.getUsersRole);
router.get('/get-user/:id', user.getUser);
router.patch('/update-user/:id', user.updateUser);
router.delete('/delete-user/:id', user.deleteUser);

// export
module.exports = router;
