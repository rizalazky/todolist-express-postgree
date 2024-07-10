const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const listController = require("../controllers/listController")
const itemController = require("../controllers/itemController")

// users
router.get('/users', userController.list)

router.post('/users', userController.add)


// end users

// list
router.get('/list',listController.list)
router.post('/list',listController.add)
router.put('/list/:id',listController.update)
router.delete('/list/:id',listController.delete)

// list items
router.get('/:listId/items',itemController.list)
router.get('/:listId/items/:id',itemController.detail)
router.post('/:listId/items',itemController.add)
router.put('/:listId/items/:id',itemController.update)
router.put('/:listId/items/:id/complete',itemController.markAsCompletedTask)
router.delete('/:listId/items/:id',itemController.delete)

module.exports = router
