import colors from 'colors';
import mongoose from 'mongoose';


const ConnectDB = async () => {
    try {
        const MongoDB_URI = process.env.MONGODB_URI;
        const connect = await mongoose.connect(MongoDB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected To DataBase SuccessFully ${connect.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Error in connecting to MongoDb ${error}`.bgRed.white);
    }
    
}


export default ConnectDB;