import mongoose from "mongoose";

// priyanshu112 : ZMc2ynI8jZbxZuh6

const Connection = async (username = 'priyanshu112', password = 'ZMc2ynI8jZbxZuh6') => {
    const url = `mongodb+srv://${username}:${password}@cluster0.9hstddh.mongodb.net/`;
    try {
        await mongoose.connect(url, {useUnifiedTopology : true, useNewUrlParser : true});
        console.log('database connected');
    }
    catch(error) {
        console.log('error while connecting : ', error);
    }
}

export default Connection;
