const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const { ensureAuthenticated, forwardAuthenticated  } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'))

router.get('/home', ensureAuthenticated, (req, res) => {
    res.render(
        'home', {
        user: req.user
        })
})

router.get('/books', ensureAuthenticated, async (req, res) => {
    Book.find({ })
    .then(books => res.send(books))
    .catch(e => res.status(500).send(e))
})

router.post('/add', ensureAuthenticated, async(req, res) => {
    const errors = []
    const book = new Book({
        ...req.body,
        owner: req.user._id
    })

    try {
        await book.save()
        res.status(201).send({ book })
    } catch(e) {
        const temp = [...e.message.replace('books validation failed: ', '').split('., ')]
        temp.forEach(err => errors.push({ msg: err }))
        res.status(400).send(errors)
    }
})

router.delete('/delete', ensureAuthenticated, async(req, res) => {
    const errors = []
    try {
        const book = await Book.findOneAndDelete({ isbn: req.body.isbn })

        if(!book) {
            return res.status(404).send()
        } else {
            await book.remove()
            res.send(book)
        }
    } catch(e) {
        errors.push({ msg: e })
        res.status(500).send(errors)
    }
})


router.patch('/modify', ensureAuthenticated, async(req, res) => {
    const errors = []
    const allowUpdate = ["title", "author", "reviews"]
    const updates = Object.keys(req.body)
    const isValidOp = updates.every(update => allowUpdate.includes(update))

    if(!isValidOp) {
        errors.push({ msg: 'Invalid updates.' })
        return res.status(400).send(errors)
    }

    try {
        const book = await Book.findOne({ _id, owner: req.user._id })

        if(!task) return res.status(404).send()

        updates.forEach(update => task[update] = req.body[update])
        await book.save
        res.send(book)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router