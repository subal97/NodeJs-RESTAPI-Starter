const express = require('express');
const postsController = require('../controllers/postsController')
const roleValidator = require('../middlewares/user.rolevalidator')
const caching =  require('../middlewares/posts.caching.middleware')

const router = express.Router();

router.post('/', caching.Lookup, postsController.GetAll, caching.CacheResponse);

router.get('/:id', caching.Lookup, postsController.GetById, caching.CacheResponse);

router.post('/create', postsController.Create);

router.patch('/:id', postsController.Update);

router.delete('/:id', [roleValidator.validateAdminRole], postsController.Delete);

router.get('/seed/:size', postsController.SeedData);

module.exports = router