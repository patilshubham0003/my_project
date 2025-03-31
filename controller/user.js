const user = require("../models/user.js");


module.exports.signup = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newuser = new user({
            email,
            username
        })


        const regestereduser = await user.register(newuser, password);
        req.login(regestereduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderlust");
            res.redirect("/listing");
        })


    } catch (error) {
        req.flash("success", error.message);
        res.redirect("/signup");
    }
}


module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you loggrd out!")
        res.redirect("/listing");
    })
}

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login");
}

module.exports.login = (req, res) => {
    const redirecturl = res.locals.redirectUrl || "/listing";
    res.redirect(redirecturl);
}