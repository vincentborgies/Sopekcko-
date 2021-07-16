// Middleware Imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const passValid = require("secure-password-validator");

// Route Mongoose Model
const User = require("../models/User");

// Password Validator Options
const options = {
  digits: true,
  letters: true,
  uppercase: true,
  lowercase: true,
  blacklist: []
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Votre adresse e-mail n'est pas valide" });
      }
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res
            .status(401)
            .json({ error: "Votre mot de passe n'est pas valide" });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }),
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.signup = (req, res, next) => {

  console.log(validator.isEmail(req.body.email));
  console.log(passValid.validate(req.body.password, options).valid);
  console.log(req.body.password);
  console.log(options)
  if (
    validator.isEmail(req.body.email) &&
    passValid.validate(req.body.password, options).valid
  ) {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
         user
          .save()
          .then(() =>
            res.status(201).json({
              message: "User created successfully!",
            })
          )
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } 
    else return res.status(400).json({
      error: "Votre adresse e-mail et mot de passe ne sont pas valides",
    });
};