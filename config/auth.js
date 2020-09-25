
module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) { return next(null); }
      res.redirect('/loginpage')
    }
  };