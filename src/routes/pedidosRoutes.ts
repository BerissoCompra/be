import {NextFunction, Router} from 'express';
import { pedidosController } from './../controllers/pedidosController'
import keys from '../keys';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth';
class PedidosRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        // pedidos/....
        this.router.get('/:id', [verifyToken] ,pedidosController.obtenerPedidosId);
        this.router.get('/cliente/:id', [verifyToken] ,pedidosController.obtenerPedidosCliente);
        this.router.get('/comercio/:id/:estado', [verifyToken] ,pedidosController.obtenerPedidosComercios);
        this.router.post('/crear', [verifyToken], pedidosController.crearPedido);
        this.router.put('/:id', [verifyToken], pedidosController.cambiarEstadoPedido);
        this.router.get('/:id/ticket', [verifyToken], pedidosController.obtenerTicket);
        this.router.delete('/:id', [verifyToken], pedidosController.eliminarPedido);
    }

}


const pedidosRoutes = new PedidosRoutes();
export default pedidosRoutes.router;