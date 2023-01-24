// router
const router = require('express').Router();

// router
const authRouter = require('./auth');
const userRouter = require('./user');
const workVisitRouter = require('./workVisit');

// set router
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/work-visit', workVisitRouter);

// export
module.exports = router;
