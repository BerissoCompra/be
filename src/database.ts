import keys from './keys';
import {connect} from 'mongoose';
    
export async function connectDb(){
    try {
        const db = await connect("mongodb+srv://berissoCompra:159753-Bc@mcdarg.nlxws.mongodb.net/MCDArg?retryWrites=true&w=majority");
        console.log("db connected", db.connection.name);
    } catch (error) {
        console.log(error)
    }                                      
}   

