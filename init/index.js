const mongoose = require('mongoose');
const intiData = require('./data');
const Listing = require('../models/listing');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected successfully to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(intiData.data);
    console.log("Data was initialized");
}

initDB();


