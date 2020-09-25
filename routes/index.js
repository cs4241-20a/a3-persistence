const express = require('express')
const path = require('path')
const router = express.Router()
const Book = require('../models/Book')
const { ensureAuthenticated } = require('../config/auth');
const passport = require('passport');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/welcome.html'))
})

router.get('/registerpage', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/register.html'))
})

router.get('/loginpage', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'))
})

router.get('/homepage',ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/home.html'))
})

router.get('/books', async (req, res) => {
    Book.find({ })
    .then(books => res.send(books))
    .catch(e => res.status(500).send(e))
})

router.post('/add', async(req, res) => {
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

router.delete('/delete', async(req, res) => {
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


router.patch('/modify', async(req, res) => {
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