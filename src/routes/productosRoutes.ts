import {NextFunction, Router} from 'express';
import { productoController} from '../controllers/productoController';
import {Request, Response} from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
class ProductosRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        //this.router.get('/:id', this.verifyToken, productoController.obtenerProductos);
        this.router.get('/productos/:id', productoController.obtenerProductosPorComercio);
        this.router.delete('/productos/:id', this.verifyToken, productoController.elimiarProducto);
        this.router.put('/productos/:id', this.verifyToken, productoController.actualizarProducto);
        this.router.post('/nuevo/:id', this.verifyToken, productoController.nuevoProducto);
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


const productosRoutes = new ProductosRoutes();
export default productosRoutes.router;