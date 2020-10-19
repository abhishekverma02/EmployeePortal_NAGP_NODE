const express = require('express')
const router = express.Router()

const openingController = require('../controllers/openingController')

router.get('/opening/create', openingController.opening_create_get);

router.post('/opening/create', openingController.opening_create_post);

router.get('/opening/:id/update', openingController.opening_update_get);

router.post('/opening/:id/update', openingController.opening_update_post);

router.get('/openings', openingController.opening_list);

router.post('/opening/:id/:userid', openingController.opening_apply_post);

router.get('/opening/:id', openingController.opening_detail);



module.exports = router;