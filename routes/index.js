const express = require('express')
const router = express.Router()
const home = require('./home')
const uploads = require('./uploads')
const auth = require('./auth')

router.use('/', home)
router.use('/auth', auth)
router.use('/uploads', uploads)

module.exports = router
