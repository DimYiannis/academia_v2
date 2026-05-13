const express = require('express')
const router = express.Router()
const { getPapers } = require('../controllers/paperController')

router.get('/', getPapers)

module.exports = router
