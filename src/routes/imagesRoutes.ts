import {NextFunction, Router} from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import { imagesController } from '../controllers/imagesController';
import multer from '../libs/multer';
class ImagesRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        this.router.post('/upload', this.verifyToken , multer.single('file'), imagesController.subirImagen);
    }

    verifyToken(req: any, res: any, next: any){
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
}

const imagesRoutes = new ImagesRoutes();
export default imagesRoutes.router;