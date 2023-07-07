import mongoose from "mongoose";


const Connection = async () => {
    const url = process.env.CONNECTION_URL;
    try {
        await mongoose.connect(url, {useUnifiedTopology : true, useNewUrlParser : true});
        console.log('database connected');
    }
    catch(error) {
        console.log('error while connecting : ', error);
    }
}

export default Connection;
