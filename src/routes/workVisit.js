// router
const router = require('express').Router();

// controllers
const workVisit = require('../controllers/workVisit');

// middlewares
const { authentication } = require('../middlewares/authentication');
const { uploadFile } = require('../middlewares/uploadFile');

// routes
router.post('/add-work-visit', uploadFile('file'), workVisit.addWorkVisit);
router.get('/get-work-visits', workVisit.getWorkVisits);
router.get('/get-work-visit/:id', workVisit.getWorkVisit);
router.patch('/update-work-visit/:id', uploadFile('file'), workVisit.updateWorkVisit);
router.delete('/delete-work-visit/:id', workVisit.deleteWorkVisit);

// export
module.exports = router;
