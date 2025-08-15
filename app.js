const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const methodOverride = require('method-override')
const path = require('path');
const app = express();
const port = 8080;

app.set("view engine","views");
app.set("views",path.join(__dirname,"views"));

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
// Home Route
app.get("/",(req,res) => {
    res.send("Home Route");
});

// Index Route
app.get("/listings", async (req,res) => {
    const  allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// New Route
app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});

// Create Route
app.post("/listings", async (req,res) => {
    // let {title, description, image, price, location, country} = req.body; alternative create a array
    // let listing = req.body.listings;
    const newListing =  new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
});

// Show Route
app.get("/listings/:id", async (req,res) => {
    let { id } = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Edit Route
app.get("/listings/:id/edit", async (req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// Update Route
app.put("/listings/:id", async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id , { ...req.body.listings }, {runValidators : true});
    res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});



// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the Beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India"
//     });
//     await sampleListing.save();
//     console.log("sample listing save to DB");
//     res.send("successful testing");
// });


app.listen(port, (req,res) => {
    console.log(`App is listening to port ${port}`);
    
});