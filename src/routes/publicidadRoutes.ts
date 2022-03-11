import {Router} from 'express';
import { productoController} from '../controllers/productoController';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import { publicidadController } from '../controllers/publicidadController';

class PublicidadRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        this.router.get('/tipo/:tipo', this.verifyToken, publicidadController.obtenerComerciosPublicidad);
        this.router.post('/alta', this.verifyToken, publicidadController.agregarComerciosPublicidad);
        this.router.post('/baja', this.verifyToken, publicidadController.eliminarComerciosPublicidad);
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


const publicidadRoutes = new PublicidadRoutes();
export default publicidadRoutes.router;