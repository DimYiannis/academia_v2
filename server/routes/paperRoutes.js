const express = require('express')
const router = express.Router()
const { getPapers, getPaper } = require('../controllers/paperController')

router.get('/', getPapers)
router.get('/:id', getPaper)

module.exports = router
