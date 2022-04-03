//import {connect} from '../database';
import {Response} from 'express';
import Comercio from '../models/Comercio';
import { TipoClientePublicidad } from '../models/enum/tipo-publicidad.enum';
import Publicidad, { PublicidadInterface } from '../models/Publicidad';
import fs from 'fs-extra';
import path from 'path';
import { Config } from '../config/api.config';

class PublicidadController{
     
    public async obtenerPublicidad(req: any, res: Response){
        const {tipo} = req.params;
        var rand = Math.random();
        const publicidades = await Publicidad.find({tipo}).sort({ rand: 1 })
        let response: any[] = [];
        if(publicidades.length > 0){
            await Promise.all(publicidades.map(async(publicidad: PublicidadInterface)=>{
                if(publicidad.tipoPublicidad === TipoClientePublicidad.COMERCIO){
                    const comercio = await Comercio.findById(publicidad.comercioId)
                    response = [{comercio, tipoPublicidad: publicidad.tipoPublicidad}, ...response]
                }
                else if(publicidad.tipoPublicidad === TipoClientePublicidad.EXTERNO){
                    response = [publicidad, ...response]
                }
            }))
            return res.status(200).json(response)
        }
        return res.status(200).json([])
    }

    public async getAllPublicidad(req: any, res: Response){
        const publicidades = await Publicidad.find({});
        if(publicidades.length > 0){
            return res.status(200).json(publicidades)
        }
        return res.status(200).json([])
    }

    public async agregarComerciosPublicidad(req: any, res: Response){
        const {comercioId, tipo} = req.body;
        const comercio = await Comercio.findById(comercioId);
        const publicidad = await new Publicidad({descripcion: comercio.nombre, comercioId, tipo, tipoPublicidad: TipoClientePublicidad.COMERCIO})
        await publicidad.save()
        .then(()=>{
            return res.status(200).json({msg: 'ok'})
        })
        .catch((err: any)=>{
            console.log(err)
            return res.status(404).json({msg: 'Error al agregar comercio a Publicidad'})
        })
       
    }

    public async eliminarComerciosPublicidad(req: any, res: Response){
        const {comercioId, tipo} = req.body;
        const eliminar = await Publicidad.deleteMany({comercioId, tipo})
        .then(()=>{
            return res.status(200).json({msg: 'ok'})
        })
        .catch((err: any)=>{
            console.log(err)
            return res.status(404).json({msg: 'Error al agregar comercio a Publicidad'})
        })
    }

    public async eliminarPublicidad(req: any, res: Response){
        const {id} = req.params;
        const publicidad = await Publicidad.findById(id)
        if(publicidad.tipoPublicidad !== TipoClientePublicidad.COMERCIO){ 
            await fs.unlink(path.resolve(publicidad.imagenPath))
            .then(()=>{})
            .catch((err)=>{
                console.log(err)
            })
        }
        await Publicidad.findByIdAndRemove(id)
        .then(()=>{
            return res.status(200).json({msg: 'ok'})
        })
        .catch((err: any)=>{
            console.log(err)
            return res.status(404).json({msg: 'Error al eliminar Publicidad'})
        })
    }

    public async crearPublicidad(req: any, res: Response){
        const {body, file} = req;
        const fileName = file.filename;
        const publicidad = await new Publicidad({ 
            ...body,
            imagen: `${Config.baseUrl}/uploads/${fileName}`,
            imagenPath: file.path, 
        });

        const publiSave = await publicidad.save();

        if(publiSave){
            return res.status(200).json({msg: 'ok'})
        }
        else{
            return res.status(404).json({msg: 'Error al crear Publicidad'})
        }
    }
 
}

export const publicidadController = new PublicidadController(); 