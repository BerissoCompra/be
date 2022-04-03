import {NextFunction, Router} from 'express';
import { comercioController} from '../controllers/comercioController';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import multer from '../libs/multer';

class ComerciosRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        //TODO Ver proximamente el middleware
        this.router.get('/', comercioController.obtenerComercios);
        this.router.get('/search/:consulta', comercioController.searchComercio);
        this.router.post('/new', comercioController.crearComercio);
        this.router.get('/obtener', this.verifyToken ,comercioController.obtenerComerciosByUserId);
        this.router.get('/filtrar/:filtro', this.verifyToken,comercioController.obtenerComerciosByFiltro);
        this.router.get('/:id', this.verifyToken,comercioController.obtenerComerciosById);
        this.router.get('/:id/usuario', this.verifyToken,comercioController.obtenerResponsableById);
        this.router.put('/:id', [this.verifyToken, multer.single('imagen')] ,comercioController.actualizarComercio);
        this.router.put('/:id/horarios', [this.verifyToken] ,comercioController.actualizarHorarioComercio);
        this.router.put('/:id/cuenta', [this.verifyToken] ,comercioController.actualizarCuentaComercio);
        this.router.delete('/:id', this.verifyToken ,comercioController.eliminarComercio);
        this.router.put('/:id/activar', this.verifyToken ,comercioController.activarComercio);
        this.router.put('/:id/registrarventa', this.verifyToken ,comercioController.registrarVenta);
        this.router.put('/:id/registrarpago', this.verifyToken ,comercioController.registrarPago);
        this.router.put('/:id/desactivar', this.verifyToken ,comercioController.desactivarComercio);
        this.router.put('/calificar/:id',comercioController.calificarComercio);
        this.router.get('/verificar/:id', this.verifyToken ,comercioController.verificarComercio);
        this.router.get('/cierrecaja/:id', this.verifyToken ,comercioController.obtenerCierreDeCaja);
        this.router.get('/cierrecaja/:id/cerrar', this.verifyToken ,comercioController.cerrarCaja);
        this.router.get('/cierrecaja/:id/ticket', this.verifyToken ,comercioController.cerrarCajaTicket);
        this.router.put('/:id/abrir', this.verifyToken ,comercioController.abrirComercio);
        this.router.put('/:id/cerrar', this.verifyToken ,comercioController.cerrarComercio);
        this.router.get('/comentarios/:id', this.verifyToken ,comercioController.obtenerComentariosByComercioId);
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