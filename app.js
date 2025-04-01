const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStatergy = require("passport-local");
const user = require("./models/user.js");
const MongoStore = require('connect-mongo');

const Listingrouter = require("./routes/listing.js");
const Reviewsrouter = require("./routes/reviews.js");
const userrouter = require("./routes/user.js");

//connectoin with db
let url = process.env.ATLAS_DBLINK;

async function main() {
    await mongoose.connect(url);
}

main().then(() => {
    console.log("mongo connected");
}).catch(err => {
    console.log(err);
})




const store = MongoStore.create({
    mongoUrl: url,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}))
app.use(flash());

//passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));







// app.get("/demouser", async(req, res) => {
//     const fakeuser = new user({
//         email: "stident@gmail.com",
//         username: "patil"
//     })

//     let newuser = await user.register(fakeuser, "helloworld");
//     res.send(newuser);
// })





// //read(show perticular data)

// ---------------throwing error because i used "/listings/:id" instead of "listings/show/:id"-----------
// app.get("/listings/:id", async(req, res) => {
//     const id = req.params.id;
//     const data = await listing.findById(id);
//     res.render("show", { data });
// });


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/", userrouter);
app.use("/listing", Listingrouter);
app.use("/listing/:id/reviews", Reviewsrouter);


app.get("/", (req, res) => {
    res.redirect("/listing")
})

app.use("*", (req, res, next) => {
    next(new expressError(404, "page not found!!!"));
})

app.use((err, req, res, next) => {
    const { status = "500", message = "somthing wrong" } = err;
    res.status(status).render("listing/error", { message })
        // res.status(status).send(message);
})


app.listen(8080, () => {
    console.log("server start in 8080")
});