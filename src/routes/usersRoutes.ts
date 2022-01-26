import {NextFunction, Router} from 'express';
import {usersController} from './../controllers/usersController';
import keys from '../keys';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

class UsersRoutes {
    public router: Router = Router();
    constructor(){
        this.config();
    }
    config():void{
        this.router.post('/signin', usersController.iniciarSesion);
        this.router.post('/signup', usersController.crearUsuario);

        this.router.post('/cliente/signin', usersController.iniciarSesionCliente);
        this.router.post('/cliente/signup', usersController.crearUsuarioCliente);
        this.router.get('/cliente', this.verifyToken, usersController.getClienteById);

        this.router.put('/cliente/:id/fav', this.verifyToken, usersController.addFavorito);
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


const usersRoutes = new UsersRoutes();
export default usersRoutes.router;