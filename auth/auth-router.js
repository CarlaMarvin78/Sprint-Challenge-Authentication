const router = require('express').Router();
const db = require('../database/auth-model');
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  if(req.body.username && req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    db.insert(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
  } else {
    res.status(400).json({message: "Username and password required."})
  }
});

router.post('/login', (req, res) => {
  if(req.body.username && req.body.password) {
    db.findByUsername(req.body.username)
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password,user.password)) {
        req.session.user=user;
        res.status(200).json({message: "Welcome "+user.username+"!"});
      } else {
        res.status(401).json({message: "You shall not pass!"})
      }
    })
    .catch(err => res.status(500).json(err));
  } else {
    res.status(400).json({message: "Username and password required."})
  }
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
        if (err) {res.status(500).json({error: "Error logging out."})}
        else {res.status(200).json({message: "Logged out."})}
    })
  } else {
      res.status(200).json({message: "Not logged in."});
  }
});

module.exports = router;
