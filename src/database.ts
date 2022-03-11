import {connect} from 'mongoose';
import dotenv = require('dotenv');
dotenv.config();

export async function connectDb(){
    try {
        // const db = await connect(process.env.DB_CONNECTION_DEV as string);
        const db = await connect(process.env.DB_CONNECTION_LOC as string);
        console.log("db connected", db.connection.name);
    } catch (error) {
        console.log(error)
    }                                      
}   
