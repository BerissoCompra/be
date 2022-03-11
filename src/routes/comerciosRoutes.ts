import {NextFunction, Router} from 'express';
import { comercioController} from '../controllers/comercioController';
import keys from '../keys';
import jwt from 'jsonwebtoken';
class ComerciosRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        //TODO Ver proximamente el middleware
        this.router.get('/', comercioController.obtenerComercios);
        this.router.post('/new', comercioController.crearComercio);
        this.router.get('/obtener', this.verifyToken ,comercioController.obtenerComerciosByUserId);
        this.router.get('/filtrar/:filtro', this.verifyToken,comercioController.obtenerComerciosByFiltro);
        this.router.get('/:id', this.verifyToken,comercioController.obtenerComerciosById);
        this.router.get('/:id/usuario', this.verifyToken,comercioController.obtenerResponsableById);
        this.router.put('/:id', this.verifyToken ,comercioController.actualizarComercio);
        this.router.delete('/:id', this.verifyToken ,comercioController.eliminarComercio);
        this.router.put('/:id/activar', this.verifyToken ,comercioController.activarComercio);
        this.router.put('/:id/registrarventa', this.verifyToken ,comercioController.registrarVenta);
        this.router.put('/:id/registrarpago', this.verifyToken ,comercioController.registrarPago);
        this.router.put('/:id/desactivar', this.verifyToken ,comercioController.desactivarComercio);
        this.router.put('/calificar/:id',comercioController.calificarComercio);
        this.router.get('/verificar/:id', this.verifyToken ,comercioController.verificarComercio);
        this.router.put('/:id/abrir', this.verifyToken ,comercioController.abrirComercio);
        this.router.put('/:id/cerrar', this.verifyToken ,comercioController.cerrarComercio);
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

const comerciosRoutes = new ComerciosRoutes();
export default comerciosRoutes.router;