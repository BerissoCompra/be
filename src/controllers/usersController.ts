import {Request, Response} from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import Cliente from '../models/Cliente';
import Comercio from '../models/Comercio';
import CodigosRecuperacion from '../models/CodigosRecuperacion';
import { sendEmail } from '../config/mailer';

class UsersController{

    public async iniciarSesion(req: Request, res: Response){
        const {email, password} = req.body;
        const usuarioExiste = await Usuario.find({email: email, password: password})
        if(usuarioExiste.length > 0){
            let activado: boolean = await usuarioExiste[0].emailActivado;
            let  data = JSON.stringify({uid: usuarioExiste[0]._id});
            if(usuarioExiste[0]?.rol){
                data = JSON.stringify({uid: usuarioExiste[0]._id, rol: usuarioExiste[0]?.rol});
                activado = true;
            }
            const token = jwt.sign(data, keys.seckey)
            console.log(activado)
            return await res.status(200).json({token: token, activado});
        }
        else{
            return await res.status(500).json({msg: 'El usuario y/o contraseña son incorrectos'})
        }
    }
  
    public async crearUsuario(req: Request, res: Response){
        const {email} = req.body;
        const usuarioExiste = await Usuario.find({email: email.toLowerCase()})

        if(usuarioExiste.length > 0){
            return res.status(200).json({msg: 'El email ingresado ya se encuentra registrado.'});
        }
        else{ 
            const nuevoUsuario = new Usuario(req.body);
            const usuarioRegistrado = await nuevoUsuario.save() 
            if(usuarioRegistrado){
                const urlActivacion = `http://localhost:4200/accountverify/${usuarioRegistrado._id}`
                const html = `<div style="">
                <h2 style="text-align: center; color: #333;">Verificación de Cuenta</h2>
                <p style="text-align: center; color: blueviolet;">Haz click en el siguiente enlace para verificar su cuenta</p>
                <a href="${urlActivacion}" style="text-align: center; background-color: blueviolet; color: #fff; padding: 10px; text-decoration: none; margin: 0 auto;">VERIFICAR</a>
                </div>`;
                await sendEmail('Activar Cuenta | Responsable de Comercio', email, 'Servicio de activación', html)
                return res.status(200).json({_id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre});
            }
            else{
                return res.status(404).json({msg: 'No se pudo registrar.'});
            }
        }
    }

    public async iniciarSesionCliente(req: Request, res: Response){
        const {email, password} = req.body;
        const usuarioExiste = await Cliente.find({email: email, password: password})

        if(usuarioExiste.length > 0){
            const data = JSON.stringify({uid: usuarioExiste[0]._id});
            const token = jwt.sign(data, keys.seckey)
            return res.status(200).json({token, finalizoTutorial: usuarioExiste[0].finalizoTutorial});
        }
        else{
            return res.status(404).json({msg: 'El usuario y/o contraseña son incorrectos'})
        }
    }

    public async VerificarCuenta(req: Request, res: Response){
        const {id} = req.params;
        const usuarioExiste = await Usuario.findOne({_id: id})

        if(usuarioExiste){
            if(usuarioExiste.emailActivado === true){
                return res.status(404).json({msg: 'Este usuario ya se encuentra activado.'})
            }
            else{
                await Usuario.updateOne({_id: id}, {emailActivado: true})
                .then(()=>{
                    return res.status(200).json({msg: 'Usuario Activado'})
                })
                .catch((msg)=>{
                    return res.status(404).json({msg})
                })
            }
        }
        else{
            return res.status(404).json({msg: 'No existe el usuario'})
        }

        
    }
  
    public async crearUsuarioCliente(req: Request, res: Response){
        const {email, terminos} = req.body;
        const usuarioExiste = await Cliente.find({email: email.toLowerCase()})
        if(usuarioExiste.length > 0){
            console.log('El email ingresado ya se encuentra registrado.')
            return res.status(404).json({msg: 'El email ingresado ya se encuentra registrado.'});
        }
        else if(!terminos){
            console.log('Debe aceptar los Términos y Condiciones.')
            return res.status(404).json({msg: 'Debe aceptar los Términos y Condiciones.'});
        }
        else{
            const nuevoUsuario = new Cliente(req.body);
            const usuarioRegistrado = await nuevoUsuario.save()
            if(usuarioRegistrado){
                return res.status(200).json({_id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre});
            }
            else{
                return res.status(404).json({msg: 'No se pudo registrar.'});
            }
        }
    }

    public async getClienteById(req: Request | any, res: Response){
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

    public async addFavorito(req: Request, res: Response){
        const {id} = req.params;
        const {comercioId} = req.body;

        let nuevosFavoritos: any[] = [];
        let respuesta: boolean = false;

        const cliente = await Cliente.findById(id);

        if(cliente){
            const existe = cliente.favoritos.filter((fav: string)=> fav === comercioId);
            if(existe.length > 0){
                nuevosFavoritos = cliente.favoritos.filter((fav: string)=> fav != comercioId);
                respuesta = false;
            }
            else{
                nuevosFavoritos = [...cliente.favoritos, comercioId]
                respuesta = true;
            }

            await Cliente.updateOne({_id: id}, {favoritos: nuevosFavoritos})
            return res.status(200).json({msg: respuesta});
        }
        else{
            return res.status(404).json({msg: 'No se encontro el cliente'});
        }

    }

    public async obtenerFavoritos(req: Request, res: Response): Promise<Response<any>>{
        const {id} = req.params;
        const cliente = await Cliente.findOne({_id: id});
        if(cliente){
            let comerciosFavoritos: any[] = [];
            await Promise.all(
                cliente.favoritos.map(async(comercioId: string)=>{
                    await Comercio.findById(comercioId)
                    .then((comercio)=>{
                        if(comercio){
                            comerciosFavoritos = [...comerciosFavoritos, comercio]
                        }
                    })
                    .catch((err: any)=> {
                        console.log(err);
                        return res.status(404).json({msg: 'Error al obtener comercio fav.'});
                    });
                })
            )
            
            return res.status(200).json(comerciosFavoritos)
            
        }
        else{
            return res.status(404).json({msg: 'Id inexistente'})
        }
    }

    public async EnviarCodigoVerificacion(req: Request, res: Response): Promise<Response<any>>{
        const {email} = req.body;
        const cliente = await Usuario.findOne({email});

        if(cliente){
            const codigoRecuperacion = {
                email,
                codigo: `AC-${Math.round(Math.random() * 10000)}`
            }
            const html = `<h2>Aplicación ciudad | CODIGO:</h2><p>${codigoRecuperacion.codigo}</p>`;
            const crearCodigo = new CodigosRecuperacion(codigoRecuperacion)
            await crearCodigo.save();
            await sendEmail('Recuperación de contraseña', email, 'Servicio de recuperación', html)
            return res.status(200).send({msg: true});
        }
        else{
            return res.status(404).json({msg: 'El usuario no existe'})
        }
    }

    public async updateCliente(req: Request, res: Response){
        const usuarioActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body)
        .then(()=> {return res.status(200).json({msg: 'Actualizado'})})
        .catch(err=> {console.log(err); return res.status(404).json({msg: 'No se pudo actualizar'})})
    } 
    
    public async verificarCodigo(req: Request, res: Response){
        const {email, codigo} = req.body;
        const buscarCodigo = await CodigosRecuperacion.findOne({codigo, email}).catch((err)=> res.status(500).json({msg: err})) 

        if(buscarCodigo){
            return res.status(200).json({msg: email});
        }
        else{
            return res.status(404).json({msg: 'No se pudo registrar.'});
        }
    }

    public async RecuperarPassword(req: Request, res: Response): Promise<Response<any>>{
        const {codigo, password} = req.body;
        const codigoRecuperacion = await CodigosRecuperacion.findOne({codigo});

        if(codigoRecuperacion){
            const usuario = await Usuario.findOne({email: codigoRecuperacion.email});
            if(usuario){
                await Usuario.updateOne({_id: usuario._id}, {password});
                await CodigosRecuperacion.deleteOne({codigo, email: codigoRecuperacion.email})
                return res.status(200).json({msg: 'Contraseña actualizada.'});
            }
            else{
                return res.status(404).json({msg: 'Error.'});
            }
        }
        else{
            return res.status(404).json({msg: 'Error.'});
        }
    }

 
}

export const usersController = new UsersController();