const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        
        // Never use fallback in production
        if (process.env.NODE_ENV === 'production') {
            console.error('Critical database connection failure in production environment. Exiting.');
            process.exit(1);
        }
        
        console.log('Attempting to start MongoDB Memory Server as fallback for testing/development...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log(`MongoDB Memory Server Connected: ${mongoUri}`);
        } catch (memError) {
            console.error(`Memory Server Error: ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
