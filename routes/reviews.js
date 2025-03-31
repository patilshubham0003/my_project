const express = require("express");
const router = express.Router({ mergeParams: true });
const methodOverride = require("method-override");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { validateReviews, isLogin, isreviewowner } = require("../middleware.js");
const reviewsController = require("../controller/reviews.js");


//review post
router.post("/", isLogin, asyncWrap(reviewsController.createReviews))

//review delete
router.delete("/:reviewId", isLogin, isreviewowner, asyncWrap(reviewsController.destroyReview))

module.exports = router;