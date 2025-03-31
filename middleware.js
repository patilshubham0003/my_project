const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listing = require("./models/listing");
const review = require("./models/review.js");


module.exports.isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in");
        res.redirect("/login")
    }
    next();
}

module.exports.saveRedirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isowner = async(req, res, next) => {
    let id = req.params.id;
    let Listing = await listing.findById(id);
    if (res.locals.currUser) {
        if (!Listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "you have not permission to change in listing")
            return res.redirect(`/listing/${id}`);
        }
    }

    next();
}


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => (el.message)).join(",");
        throw new expressError(400, errmsg);
    } else {
        next();
    }
}


module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error.message);
    } else {
        next();
    }
}


module.exports.isreviewowner = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let Review = await review.findById(reviewId);
   
    if (res.locals.currUser) {
        if (!Review.author._id.equals(res.locals.currUser._id)) {
            req.flash("error", "you have not permission delete reviews")
            return res.redirect(`/listing/${id}`);
        }
    }

    next();
}