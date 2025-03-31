const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { saveRedirecturl } = require("../middleware.js");
const userController = require("../controller/user.js");


//signup
router.route("/signup").get((req, res) => {
        res.render("user/signup");
    })
    .post(asyncWrap(userController.signup))

//login
router.route("/login").get(userController.renderLoginForm)
    .post(saveRedirecturl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,

    }), userController.login);

//logout
router.get("/logout", userController.logout)


module.exports = router;