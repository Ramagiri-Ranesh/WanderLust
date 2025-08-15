const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title : {
        type : String,
        require : true
    },
    description : {
        type : String,
    },
    image : {
        type : String,
        default : "https://unsplash.com/photos/brown-wooden-house-on-beach-during-daytime-8SuNIFnfKZY",
        set : (v) => v === "" ? "https://unsplash.com/photos/brown-wooden-house-on-beach-during-daytime-8SuNIFnfKZY" : v,
    },
    price : {
        type : Number,
        require : true
    },
    location : {
        type : String,
        require : true
    },
    country : {
        type : String,
        require : true
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

