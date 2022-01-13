
import {Request, Response} from 'express';
import ComercioModel from '../models/Comercio';
import { TipoFiltroEnum } from '../models/enum/tipo-filtro.enum';
class ComercioController{

    public async crearComercio(req: Request, res: Response){
        const comercio = new ComercioModel(req.body);
        const comercioGuardado = await comercio.save();
        if(comercioGuardado){
            return res.status(200).json({ok: 'Comercio creado.'});
        }
        else{
            return res.status(500).json({err: 'El comercio no se pudo crear correctamente.'});
        }

        
    }

    public async obtenerComercios(req: Request, res: Response){
        const comercios = await ComercioModel.find({});
        return res.status(200).json(comercios);
    }

    public async obtenerComerciosById(req: Request, res: Response){
        const {id} = req.params;
        const comercios = await ComercioModel.findById(id)
        if(comercios){
            return res.status(200).json(comercios);
        }
        else{
            return res.status(404).json({ok: 'No se encontro el comercio'});
        }
      
    }

    public async obtenerComerciosByFiltro(req: any, res: Response){
        const {body} = req;

        if(body.filtro === TipoFiltroEnum.ABIERTOS){
            const comercios = await ComercioModel.find({abierto: true});
            if(comercios){
                return res.status(200).json(comercios);
            }
            else{
                return res.status(404).json({ok: 'No se encontraron el comercio'});
            }
        }
        else{
            const comercios = await ComercioModel.find({});
            if(comercios){
                return res.status(200).json(comercios);
            }
            else{
                return res.status(404).json({ok: 'No se encontraron el comercio'});
            }
        }

        
    }

    public async obtenerComerciosByUserId(req: any, res: Response){
        const {uid} = req.data;
        const comercios = await ComercioModel.find({usuarioId: uid})
        if(comercios.length > 0){
            return res.status(200).json(comercios[0]);
        }
        else{
            return res.status(404).json({err: 'No se encontro el comercio'});
        }
        
    }

    public async actualizarComercio(req: any, res: Response){
        const {id} = req.params;
        const comercios = await ComercioModel.updateOne({_id: id}, req.body)
        if(comercios){
            return res.status(200).json(comercios);
        }
        else{
            return res.status(404).json({err: 'No se pudo actualizar'});
        }
        
    }

    public async calificarComercio(req: any, res: Response){
        const {id} = req.params;
        const {calificacion, contadorCalificaciones} = req.body;
        const comercios = await ComercioModel.updateOne({_id: id}, {
            puntuacion: calificacion,
            contadorCalificaciones: contadorCalificaciones
        })
        if(comercios){
            return res.status(200).json(comercios);
        }
        else{
            return res.status(404).json({err: 'No se pudo actualizar'});
        }
        
    }

    public async verificarComercio(req: any, res: Response){
        const {id} = req.params;
        console.log(id)
        const comercios = await ComercioModel.find({_id: id})
        if(comercios.length > 0){
            if(comercios[0].abierto){
                return res.status(200).json({estado: true});
            }
            else{
                return res.status(200).json({estado: false});
            }
        }
        else{
            return res.status(404).json({err: 'No se encontro el comercio'});
        }
    }
}

export const comercioController = new ComercioController();