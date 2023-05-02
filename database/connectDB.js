import mongoose from "mongoose";

const connect = async (url) => {
    const db = await mongoose.connect(url);
    console.log("Connected To The DB");

    return db;
}

export default connect;