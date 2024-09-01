const Router = require('express')
const router = new Router()
const tableController = require('../controllers/table.controller')

router.post('/table', tableController.addNewData)
router.get('/table', tableController.getData)

module.exports = router