const express = require('express')
const router = express.Router()
const { getPapers, getPaper, getFeatured } = require('../controllers/paperController')

router.get('/', getPapers)
router.get('/featured', getFeatured)
router.get('/:id', getPaper)

module.exports = router
