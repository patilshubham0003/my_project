const listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReviews = async(req, res, next) => {

    const Listing = await listing.findById(req.params.id);
    // console.log(Listing);
    const newReview = new review(req.body);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();

    // console.log("saved");
    req.flash("success", "review created successfully!! ");
    res.redirect(`/listing/${Listing._id}`);

}


module.exports.destroyReview = async(req, res, next) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted ");
    res.redirect(`/listing/${id}`);
}