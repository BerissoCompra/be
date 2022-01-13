import keys from './keys';
import {connect} from 'mongoose';
    
export async function connectDb(){
    try {
        const db = await connect("mongodb://localhost/bcdb");
        console.log("db connected", db.connection.name);
    } catch (error) {
        console.log(error)
    }                                      
}   

