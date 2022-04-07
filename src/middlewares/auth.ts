import keys from '../keys';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import Cliente from '../models/Cliente';


export const verifyToken = async(req: any, res: any, next: any) =>{
    let token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
        //const token = req.headers.authorization.substring(7);
        const decoded = jwt.verify(token, keys.seckey)
        req.data = decoded;

        const user = await Usuario.findById(req.data.uid, { password: 0 });
        const cliente = await Cliente.findById(req.data.uid, { password: 0 });

        if(cliente || user){
            next();
        }
        else{
            return res.status(404).json({ message: "No user found" });
        }
        
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
}   