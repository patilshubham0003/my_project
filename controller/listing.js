const listing = require("../models/listing");

module.exports.index = async(req, res) => {
    const allListing = await listing.find();
    res.render("listing/allListing", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new");
};

module.exports.createNewListing = async(req, res, next) => {
    let { path: url, filename } = req.file;
    let ndata = req.body;
    ndata.owner = req.user._id;
    ndata.image = { url, filename }

    const result = await listing.insertOne(ndata)
    req.flash("success", "listing created successfully");
    res.redirect("/listing");

};

module.exports.renderEditForm = async(req, res, next) => {

    const { id } = req.params;
    const data = await listing.findById(id);
    const result = await listing.findById(id);

    let originalUrl = data.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250");
    console.log(originalUrl);

    if (!result) {
        req.flash("error", "listing you requested doesn't exist");
        res.redirect("/listing")
    }
    res.render("listing/edit", { data, originalUrl });

};

module.exports.updateListing = async(req, res) => {

    let id = req.params.id;
    const ndata = req.body;

    const Listing = await listing.findByIdAndUpdate(id, ndata, { runValidators: true });

    if (typeof req.file !== "undefined") {
        let { path: url, filename } = req.file;
        Listing.image = { url, filename };
        await Listing.save();
    }


    req.flash("success", "listing updated ");
    res.redirect(`/listing/${id}`);
}

module.exports.showListing = async(req, res) => {
    const id = req.params.id;
    const data = await listing.findById(id).populate({ path: "reviews", populate: "author" }).populate("owner");
    // console.log(data);
    if (!data) {
        req.flash("error", "listing you requested doesn't exist");
        res.redirect("/listing")
    }

    res.render("listing/show", { data })
};

module.exports.destroyListing = async(req, res) => {
    let id = req.params.id;
    await listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted ");
    res.redirect("/listing")
};