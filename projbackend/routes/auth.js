const express = require("express");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

router.post(
  "/signup",
  [
    check("name") //express validator
      .isLength({ min: 3 })
      .withMessage("name must be at least 3 chars long"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("password must be at least 3 chars long"),
    check("email", "Invalid Email").isEmail(),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("password").isLength({ min: 1 }).withMessage("password is required"),
    check("email", "Email is required").isEmail(),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
