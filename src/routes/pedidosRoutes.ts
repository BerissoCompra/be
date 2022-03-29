import {NextFunction, Router} from 'express';
import { pedidosController } from './../controllers/pedidosController'
import keys from '../keys';
import jwt from 'jsonwebtoken';
class PedidosRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        // pedidos/....
        this.router.get('/:id', this.verifyToken ,pedidosController.obtenerPedidosId);
        this.router.get('/cliente/:id', this.verifyToken ,pedidosController.obtenerPedidosCliente);
        this.router.get('/comercio/:id/:estado', this.verifyToken ,pedidosController.obtenerPedidosComercios);
        this.router.post('/crear', this.verifyToken, pedidosController.crearPedido);
        this.router.put('/:id', this.verifyToken, pedidosController.cambiarEstadoPedido);
        this.router.get('/:id/ticket', this.verifyToken, pedidosController.obtenerTicket);
        this.router.delete('/:id', this.verifyToken, pedidosController.eliminarPedido);
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


const pedidosRoutes = new PedidosRoutes();
export default pedidosRoutes.router;