const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const { ensureAuthenticated, forwardAuthenticated  } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome')
})

router.get('/home', ensureAuthenticated, (req, res) => {
    res.render('home', {
        layout: 'layout2.ejs'
    })
})

router.get('/allbooks', ensureAuthenticated, async(req, res) => {
    await Book.find({ })
    .then(books => {
        res.json(books)
    })
    .catch(e => res.status(500).send(e))
})

router.get('/books', ensureAuthenticated, async(req, res) => {
    await Book.find({ owner: req.user._id })
    .then(books => {
        res.json(books)
    })
    .catch(e => res.status(500).send(e))
})

router.post('/add', ensureAuthenticated, async(req, res) => {
    const errors = []
    const book = new Book({
        ...req.body,
        owner: req.user._id
    })
    const notUniqueISBN = await Book.findOne({ isbn: book.isbn })
    if(notUniqueISBN) {
        req.flash(
            'errormsg',
            'ISBN# must be unqiue'
        )
        res.redirect('/home')

    } else{
        try {
            await book.save()
            req.flash(
                'successmsg',
                'Book added successfully'
            )
            res.redirect('/home')
        } catch(e) {
            errors.push({ msg: e })
            res.status(400).render('home', {
                errors,
                user: req.user
            })
        }
    }

})

router.post('/delete', ensureAuthenticated, (req, res) => {
    Book.findOneAndDelete({ isbn: req.body.isbn })
    .then(book => {
        if(!book) {
            req.flash('errormsg', 'Book not found')
            res.redirect('/home')
        } else{
            req.flash('successmsg', 'Book deleted successfully')
            res.redirect('/home')
        }

    })
    .catch(e => res.flash('errormsg', e))
})


router.post('/modify', ensureAuthenticated, async(req, res) => {
    const errors = []
    const updates = Object.keys(req.body)
    try {
        const book = await Book.findOne({ isbn: req.body.isbn })

        if(!book) return res.status(404).send()

        updates.forEach(update => book[update] = req.body[update])
        await book.save()
        req.flash(
            'successmsg',
            'Book updated successfully'
        )
        res.redirect('/home')
    } catch(e) {
        res.status(500).render('home', { errors })
    }
})

module.exports = router