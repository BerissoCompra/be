import {Request, Response} from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import Cliente from '../models/Cliente';
import Comercio from '../models/Comercio';
import CodigosRecuperacion from '../models/CodigosRecuperacion';
import { sendEmail } from '../config/mailer';
import { Config } from '../config/api.config';

class UsersController{

    public async iniciarSesion(req: Request, res: Response){
        try {
            const {email} = req.body;
            const usuarioExiste = await Usuario.findOne({email: email})
            if(!usuarioExiste) return await res.status(404).json({msg: 'El usuario no existe'})

            const matchPassword = await Usuario.comparePassword(
                req.body.password,
                usuarioExiste.password
            );

            if (!matchPassword) return res.status(401).json({
                token: null,
                msg: "El usuario y/o contraseña son incorrectos",
            });

            let activado: boolean = await usuarioExiste.emailActivado;
            let  data = JSON.stringify({uid: usuarioExiste._id});

            if(usuarioExiste.rol){
                data = JSON.stringify({uid: usuarioExiste._id, rol: usuarioExiste?.rol});
                activado = true;
            }

            const token = jwt.sign(data, keys.seckey)

            return await res.status(200).json({token: token, activado});

        } catch (error) {
            console.log(error);
            return await res.status(500).json({msg: 'Error al autenticar'});
        }
    }

    public async iniciarSesionCliente(req: Request, res: Response){
        try {
            const {email, password} = req.body;
            const usuarioExiste = await Cliente.findOne({email: email})

            if(!usuarioExiste)  return res.status(404).json({msg: 'El usuario y/o contraseña son incorrectos'})

            const matchPassword = await Cliente.comparePassword(
                password,
                usuarioExiste.password
            );

            if (!matchPassword) return res.status(401).json({
                token: null,
                msg: "El usuario y/o contraseña son incorrectos",
            });

            const data = JSON.stringify({uid: usuarioExiste._id});
            const token = jwt.sign(data, keys.seckey)

            return res.status(200).json({token, finalizoTutorial: usuarioExiste.finalizoTutorial});

        } catch (error) {
            return await res.status(500).json({msg: 'Error al autenticar'});
        }
    }
  
    public async crearUsuario(req: Request, res: Response){
        try {
            const {email} = req.body;
            const usuarioExiste = await Usuario.find({email: email.toLowerCase()})

            if(usuarioExiste.length > 0){
                return res.status(200).json({msg: 'El email ingresado ya se encuentra registrado.'});
            }
            else{ 
                const nuevoUsuario = new Usuario(req.body);
                nuevoUsuario.password = await Usuario.encryptPassword(nuevoUsuario.password);
                const usuarioRegistrado = await nuevoUsuario.save();

                if(usuarioRegistrado){
                    const urlActivacion = `${Config.frontUrl}/accountverify/${usuarioRegistrado._id}`
                    const html = `<div style="text-align: center;">
                    <h2 style="text-align: center; color: #333;">Verificación de Cuenta</h2>
                    <p style="text-align: center; color: blueviolet;">Haz click en el siguiente enlace para verificar su cuenta</p>
                    <a href="${urlActivacion}" style="text-align: center; background-color: blueviolet; color: #fff; padding: 10px; text-decoration: none; margin: 0 auto;">VERIFICAR</a>
                    </div>`;
                    await sendEmail('Activar Cuenta | Responsable de Comercio', email, 'Servicio de activación', html)
                    return res.status(200).json(
                        {
                            _id: usuarioRegistrado._id, 
                            nombre: usuarioRegistrado.nombre,
                        });
                }
                else{
                    return res.status(404).json({msg: 'No se pudo registrar.'});
                }
        }
        } catch (error) {
            console.error(error);
            return res.status(500).json({msg: 'No se pudo registrar.'});
        }
    }

    public async crearUsuarioCliente(req: Request, res: Response){
        try {
            const {email, terminos} = req.body;
            const usuarioExiste = await Cliente.findOne({email: email.toLowerCase()})
            console.log(req.body)
            if(usuarioExiste) return res.status(404).json({msg: 'El email ingresado ya se encuentra registrado.'});
            if(!terminos) return res.status(404).json({msg: 'Debe aceptar los Términos y Condiciones.'});

            const nuevoUsuario = new Cliente(req.body);
            console.log(req.body)
            nuevoUsuario.password = await Cliente.encryptPassword(nuevoUsuario.password);
            const usuarioRegistrado = await nuevoUsuario.save()
            if(usuarioRegistrado){
                return res.status(200).json({_id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre});
            }
            else{
                return res.status(404).json({msg: 'No se pudo registrar.'});
            }
        } catch (error) {
            return res.status(500).json({msg: 'No se pudo registrar.'});
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

    public async verificarUsuario(req: any, res: Response){
        const {uid} = req.data;
        const cliente = await Cliente.findById(uid);

        if(cliente){
            return res.status(200).json({valido: true, tutorial: cliente.finalizoTutorial})
        }
        else{
            return res.status(200).json({valido: false, tutorial: cliente.finalizoTutorial})
        }
    }

    public async finalizarTutorial(req: any, res: Response){
        try {
            const {uid} = req.data;
            const actualizarCliente = await Cliente.findByIdAndUpdate(uid, {finalizoTutorial: true});
            if(actualizarCliente){
                return res.status(200).json({msg: 'Tutorial finalizado'})
            }
            else{
                return res.status(404).json({msg: 'Error al finalizar tutorial'})
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: 'Error al finalizar tutorial'})
        }
    }
  
    public async getClienteById(req: Request | any, res: Response){
        try {
            const {uid} = req.data;
            const cliente = await Cliente.findById(uid)
            if(cliente){
                const {password, ...rest} = cliente._doc;
                return res.status(200).json(rest);
            }
            else{
                return res.status(404).json({ok: 'No se encontro el usuario'});
            }
        } catch (error) {
            return res.status(500).json({ok: 'No se encontro el usuario'});
        }
    }

    public async addFavorito(req: Request, res: Response){
        try {
            const {id} = req.params;
            const {comercioId} = req.body;

            let nuevosFavoritos: any[] = [];
            let respuesta: boolean = false;

            const cliente = await Cliente.findById(id);

            if(!cliente) return res.status(404).json({msg: 'No se encontro el cliente'});

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

        } catch (error) {
            return res.status(500).json({msg: 'No se encontro el cliente'});
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
        const {email, rol} = req.body;

        if(rol === 'comercio'){
            const usuario = await Usuario.findOne({email});

            if(usuario){
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

        if(rol === 'cliente'){
            const usuario = await Cliente.findOne({email});
            console.log(usuario)
            if(usuario){
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
        const {codigo, password, rol} = req.body;
        const codigoRecuperacion = await CodigosRecuperacion.findOne({codigo});

        if(codigoRecuperacion){
            if(rol === 'comercio'){
                const usuario = await Usuario.findOne({email: codigoRecuperacion.email});
                const nuevaPassword = await Usuario.encryptPassword(password);
                if(usuario){
                    await Usuario.updateOne({_id: usuario._id}, {password: nuevaPassword});
                    await CodigosRecuperacion.deleteOne({codigo, email: codigoRecuperacion.email})
                    return res.status(200).json({msg: 'Contraseña actualizada.'});
                }
                else{
                    return res.status(404).json({msg: 'Error.'});
                }
            }

            if(rol === 'cliente'){
                const usuario = await Cliente.findOne({email: codigoRecuperacion.email});
                const nuevaPassword = await Cliente.encryptPassword(password);
                if(usuario){
                    await Cliente.updateOne({_id: usuario._id}, {password: nuevaPassword});
                    await CodigosRecuperacion.deleteOne({codigo, email: codigoRecuperacion.email})
                    return res.status(200).json({msg: 'Contraseña actualizada.'});
                }
                else{
                    return res.status(404).json({msg: 'Error.'});
                }
            }
        }
        else{
            return res.status(404).json({msg: 'Error.'});
        }
    }

 
}

export const usersController = new UsersController();