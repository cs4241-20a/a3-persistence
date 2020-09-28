const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')
const Book = require('./Book')

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        trim: true, 
        unique: true,
        validate(email) {
            if(!validator.isEmail(email)) {
                throw new Error('Error, please provide an email address.')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: [7, 'Error, password should at least contain 7 characters.'],
        validate(pwd) {
            if(validator.contains(pwd, 'password')) {
                throw new Error("Error, please provide a valid password")
            }
        }
    },
    githubid: {
        type: String,
        parse: true
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.plugin(uniqueValidator, {  message: 'Error, expected {PATH} to be unique.' })

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
  })

  // statics can be accessed directly thru models
  userSchema.static.findByCredentials = async(email, password) => {
      const user = await User.findOne({ email })
      if(!user) {
          throw new Error('Unable to log in')
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) {
          throw new Error('Unable to log in')
      }

      return user
  }

  // Middleware allows us to register some functions to run before or after an event occurs
  userSchema.pre('save', async function (next) { 
    // keyword this gives us access to the current user
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
}) 

// on removing the user, also remove their boks records
userSchema.pre('remove', async function(next) {
    const user = this
    await Book.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('users', userSchema)

module.exports = User