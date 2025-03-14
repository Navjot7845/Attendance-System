import mongoose from 'mongoose';

async function connectToMongoDB() {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/attendance`)
    } catch (error) {
        console.log(error);
    }
}

export default connectToMongoDB;


