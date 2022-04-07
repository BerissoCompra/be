import {NextFunction, Router} from 'express';
import {usersController} from './../controllers/usersController';
import keys from '../keys';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth';

class UsersRoutes {
    public router: Router = Router();
    constructor(){
        this.config(); 
    }
    config():void{
        this.router.post('/signin', usersController.iniciarSesion);
        this.router.post('/signup', usersController.crearUsuario);
        this.router.post('/codigoverificacion', usersController.EnviarCodigoVerificacion);
        this.router.put('/:id/accountverify', usersController.VerificarCuenta);
        this.router.put('/verificarCodigo', usersController.verificarCodigo);
        this.router.put('/actualizarpassword', usersController.RecuperarPassword);

        this.router.post('/cliente/signin', usersController.iniciarSesionCliente);
        this.router.post('/cliente/signup', usersController.crearUsuarioCliente);
        this.router.get('/cliente', [verifyToken], usersController.getClienteById);
        this.router.post('/cliente/verificar', [verifyToken], usersController.verificarUsuario);
        this.router.put('/cliente/:id', [verifyToken], usersController.updateCliente);
        this.router.put('/cliente/:id/fav', [verifyToken], usersController.addFavorito);
        this.router.get('/cliente/:id/fav', [verifyToken], usersController.obtenerFavoritos);
    }

}


const usersRoutes = new UsersRoutes();
export default usersRoutes.router;