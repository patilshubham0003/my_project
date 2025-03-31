if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { findById } = require("../models/review.js");
const { isLogin, isowner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//routes


//index
router.get("/", listingController.index);

router.route("/new").get(isLogin, listingController.renderNewForm)
    .post(isLogin, upload.single("image"), validateListing, asyncWrap(listingController.createNewListing));
// .post(, (req, res) => {
//     res.send(req.file);
// });


router.route("/edit/:id").get(isLogin, isowner, asyncWrap(listingController.renderEditForm))
    .patch(isLogin, isowner, upload.single("image"), validateListing, asyncWrap(listingController.updateListing));


router.route("/:id").get(asyncWrap(listingController.showListing))
    .delete(isLogin, isowner, asyncWrap(listingController.destroyListing));

module.exports = router;