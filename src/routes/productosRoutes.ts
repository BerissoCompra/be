import {Router} from 'express';
import { productoController} from '../controllers/productoController';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth';

class ProductosRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        //this.router.get('/:id', [verifyToken], productoController.obtenerProductos);
        this.router.get('/productos/:id', productoController.obtenerProductosPorComercio);
        this.router.delete('/productos/:id', [verifyToken], productoController.elimiarProducto);
        this.router.put('/productos/:id', [verifyToken] ,productoController.actualizarProducto);
        this.router.put('/productos/:id/activar', [verifyToken] ,productoController.activarProducto);
        this.router.put('/productos/:id/desactivar', [verifyToken] ,productoController.desactivarProducto);
        this.router.post('/productos/nuevo', [verifyToken], productoController.nuevoProducto);
    }

}


const productosRoutes = new ProductosRoutes();
export default productosRoutes.router;