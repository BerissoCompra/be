import {connect} from 'mongoose';
    
export async function connectDb(){
    try {
        // const db = await connect("mongodb+srv://berissoCompra:159753-Bc@mcdarg.nlxws.mongodb.net/MCDArg?retryWrites=true&w=majority");
        const db = await connect("mongodb://localhost/bcdb");
        console.log("db connected", db.connection.name);
    } catch (error) {
        console.log(error)
    }                                      
}   
