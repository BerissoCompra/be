import {Request, Response} from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import Cliente from '../models/Cliente';
class UsersController{

    public async iniciarSesion(req: Request, res: Response){
        const {email, password} = req.body;
        const usuarioExiste = await Usuario.find({email: email, password: password})
        if(usuarioExiste.length > 0){
            const data = JSON.stringify({uid: usuarioExiste[0]._id});
            const token = jwt.sign(data, keys.seckey)
            return res.status(200).json({token: token});
        }
        else{
            return res.status(500).json({error: 'El usuario y/o contraseña son incorrectos'})
        }
    }
  
    public async crearUsuario(req: Request, res: Response){
        const {email} = req.body;
        const usuarioExiste = await Usuario.find({email: email.toLowerCase()})

        if(usuarioExiste.length > 0){
            return res.status(200).json({err: 'El email ingresado ya se encuentra registrado.'});
        }
        else{
            const nuevoUsuario = new Usuario(req.body);
            const usuarioRegistrado = await nuevoUsuario.save()
            if(usuarioRegistrado){
                return res.status(200).json({_id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre});
            }
            else{
                return res.status(404).json({err: 'No se pudo registrar.'});
            }
        }
    }

    public async iniciarSesionCliente(req: Request, res: Response){
        const {email, password} = req.body;
        const usuarioExiste = await Cliente.find({email: email, password: password})
        if(usuarioExiste.length > 0){
            const data = JSON.stringify({uid: usuarioExiste[0]._id});
            const token = jwt.sign(data, keys.seckey)
            return res.status(200).json({token});
        }
        else{
            return res.status(500).json({error: 'El usuario y/o contraseña son incorrectos'})
        }
    }
  
    public async crearUsuarioCliente(req: Request, res: Response){
        const {email} = req.body;
        const usuarioExiste = await Cliente.find({email: email.toLowerCase()})
        if(usuarioExiste.length > 0){
            return res.status(200).json({err: 'El email ingresado ya se encuentra registrado.'});
        }
        else{
            const nuevoUsuario = new Cliente(req.body);
            const usuarioRegistrado = await nuevoUsuario.save()
            if(usuarioRegistrado){
                return res.status(200).json({_id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre});
            }
            else{
                return res.status(404).json({err: 'No se pudo registrar.'});
            }
        }
    }

    public async getClienteById(req: any, res: Response){
        const {uid} = req.data;
        const cliente = await Cliente.findById(uid)
        if(cliente){
            const {password, ...rest} = cliente._doc;
            return res.status(200).json(rest);
        }
        else{
            return res.status(404).json({ok: 'No se encontro el comercio'});
        }
    }

    public async addFavorito(req: any, res: Response){
        const {id} = req.params;
        const {comercio} = req.body;
        let nuevosFavoritos: any[] = [];
        let respuesta: boolean = false;
        
        await Cliente.findOne({_id: id})
        .then((client: {favoritos: any[]})=>{
            const existe = client.favoritos.filter((fav)=> fav._id === comercio._id);
            if(existe.length > 0){
                nuevosFavoritos = client.favoritos.filter((fav)=> fav._id != comercio._id);
                respuesta = false;
            }
            else{
                nuevosFavoritos = [...client.favoritos, comercio]
                respuesta = true;
            }
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se encontro el cliente'});
        })

        await Cliente.updateOne({_id: id}, {favoritos: nuevosFavoritos})
        .then((re)=>{
            console.log(re)
            return res.status(200).json({msg: respuesta});
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se encontro el cliente'});
        })

    }
 
}

export const usersController = new UsersController();