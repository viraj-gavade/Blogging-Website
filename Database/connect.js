require('dotenv').config()
const mongoose = require('mongoose')


const connectDB = async (db_url) =>{
    try {
        const connect = mongoose.connect(
            process.env.MONGO_URI,{
                useNewUrlParser: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
            useUnifiedTopology: true,
            }
        )
        console.log(`\n Connected to Database!!, Connection Host:${connect.connection.host} `);
    } catch (error) {
        
    }
}

module.exports = connectDB