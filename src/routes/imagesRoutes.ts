import {NextFunction, Router} from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import { imagesController } from '../controllers/imagesController';
import multer from '../libs/multer';
import { verifyToken } from '../middlewares/auth';
class ImagesRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        this.router.post('/upload', [verifyToken , multer.single('file')], imagesController.subirImagen);
    }
}

const imagesRoutes = new ImagesRoutes();
export default imagesRoutes.router;