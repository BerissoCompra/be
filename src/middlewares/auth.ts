import keys from '../keys';
import jwt from 'jsonwebtoken';


export const verifyToken = (req: any, res: any, next: any) =>{
    if(!req.headers.authorization) return res.status(401).json('No Autorizado');
    const token = req.headers.authorization.substring(7);
    if(token!==''){
        const content = jwt.verify(token, keys.seckey)
        req.data = content;
        next();
    }
    else{ 
        return res.status(401).json('No Token');
    }
}   