//import {connect} from '../database';
import {Response} from 'express';
import Comercio from '../models/Comercio';
import Publicidad, { PublicidadInterface } from '../models/Publicidad';


class PublicidadController{
     
    public async obtenerComerciosPublicidad(req: any, res: Response){
        const {tipo} = req.params;
        var rand = Math.random();
        const comerciosPublicidad = await Publicidad.find({tipo}).sort({ rand: 1 })
        let response: any[] = [];
        if(comerciosPublicidad.length > 0){
            await Promise.all(comerciosPublicidad.map(async(publicidad: PublicidadInterface)=>{
                const comercio = await Comercio.findById(publicidad.comercioId)
                response = [comercio, ...response]
            }))
            return res.status(200).json(response)
        }

        
        return res.status(200).json([])
    }

    public async agregarComerciosPublicidad(req: any, res: Response){
        const {comercioId, tipo} = req.body;
        const publicidad = await new Publicidad({comercioId, tipo})
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
 
}

export const publicidadController = new PublicidadController();