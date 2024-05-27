const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database is connected");
    } catch (error) {
        console.log(error);
        console.log("Database is connection is failed");
    }
}

module.exports = { ConnectDB };