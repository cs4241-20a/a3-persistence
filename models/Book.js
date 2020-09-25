const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: String,
        trim: true,
        required: true
    },
    isbn: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'User'
    },
    owner_github: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'GithubUser'
    },
    reviews: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

bookSchema.plugin(uniqueValidator, {  message: 'Error, expected {PATH} to be unique.' })

bookSchema.static.findByISBN = async(isbn) => {
    const book = await Book.findOne({ isbn })
    return book
}

const Book = mongoose.model('books', bookSchema)

module.exports = Book