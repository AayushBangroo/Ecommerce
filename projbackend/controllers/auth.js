const User = require("../models/user.js");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const user = new User(req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT ABLE TO SAVE USER IN DB",
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      password: user.encry_password,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email does not exist",
      });
    }
    // now check if passsword is correct
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    //Now user is verified
    //create token
    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    //send response to front end
    const { _id, name, email, role } = user;

    res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "signout successful" });
};

//protected route
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth", //this property is added to the request during sign in
});

//custom middlewares

exports.isAuthenticated = (req, res, next) => {
  //remember to put next() in custom middlewares
  let checker = req.profile && req.auth && req.profile._id == req.auth.id; // === will not work
  // console.log(req.profile);
  // console.log(req.auth);
  // console.log(req);
  if (!checker) {
    return res.status(403).json({
      message: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  //remember to put next() in custom middlewares
  let checker = req.profile.role === 1; //check is user is admin i.e role=1
  if (!checker) {
    return res.status(403).json({
      message: "ACCESS DENIED YOU ARE NOT AN ADMIN",
    });
  }
  next();
};
