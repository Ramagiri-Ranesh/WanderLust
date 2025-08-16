const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const methodOverride = require('method-override')
const path = require('path');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { listingSchema } = require('./schema');
const app = express();
const port = 8080;


app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected successfully to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
};


// Home Route
app.get("/",(req,res) => {
    res.send("Home Route");
});

// Index Route
app.get("/listings", wrapAsync(async (req,res) => {
    const  allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Route
app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});

// Create Route
app.post("/listings", validateListing, wrapAsync(async (req,res) => {
    // let {title, description, image, price, location, country} = req.body; alternative create a array
    // let listing = req.body.listings;
    const newListing =  new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
}));

// Show Route
app.get("/listings/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id , { ...req.body.listings }, {runValidators : true});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// if it dose n't match any route
// Catch-all 404 (works in Express 5)
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error handling - middleware
app.use((err,req,res,next) => {
    let {status = 500, message="Something went Wrong!"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
});

app.listen(port, (req,res) => {
    console.log(`App is listening to port ${port}`);
    
});