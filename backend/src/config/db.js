const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.log('Attempting to start MongoDB Memory Server as fallback for testing...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log(`MongoDB Memory Server Connected: ${mongoUri}`);
        } catch (memError) {
            console.error(`Memory Server Error: ${memError.message}`);
            console.log('Backend will continue running, but DB queries will fail.');
        }
    }
};

module.exports = connectDB;
