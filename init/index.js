const mongoose = require("mongoose");
const listing = require("../models/listing.js");
let initdata = require("./data.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(() => {
    console.log("connected")
}).catch(err => {
    console.log(err);
})

async function newdata() {
    await listing.deleteMany({});
    console.log("data deleted");
    initdata = initdata.map((obj) => ({...obj, owner: '67d531ec618454237865ae0e' }));

    await listing.insertMany(initdata);
    console.log("data reinisilized");
}

newdata();