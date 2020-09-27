const express = require('express')
const router = express.Router()

const Grocery = require('../models/Grocery')

router.get('/groceries', (req,res) => res.render('groceries'));

//add groceries to the database
router.post('/groceries', (req,res) => {
  const {item, price, dept} = req.body;
  const newGrocery = new Grocery({
    item,
    price,
    dept
  });
  newGrocery.save();
})

module.exports = router;