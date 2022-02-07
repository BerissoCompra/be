
import {Request, Response} from 'express';
import ComercioModel from '../models/Comercio';
import { TipoFiltroEnum } from '../models/enum/tipo-filtro.enum';
class ComercioController{

    public async crearComercio(req: Request, res: Response){
        const comercio = new ComercioModel(req.body);
        const comercioGuardado = await comercio.save();
        if(comercioGuardado){
            return res.status(200).json({msg: 'Comercio creado.'});
        }
        else{
            return res.status(500).json({msg: 'El comercio no se pudo crear correctamente.'});
        }
    }

    public async obtenerComercios(req: Request, res: Response){
        const comercios = await ComercioModel.find({});
        return res.status(200).json(comercios);
    }

    public async obtenerComerciosById(req: Request, res: Response){
        const {id} = req.params;
        const comercios = await ComercioModel.findById(id)
        .then((comercio)=>{
            return res.status(200).json(comercio);
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se encontro el comercio'});
        })
     
    }

    public async obtenerComerciosByFiltro(req: any, res: Response){
        const {body} = req;
        const {filtro} = req.params;
        
        console.log(filtro)

        if(filtro === TipoFiltroEnum.ABIERTOS){
            const comercios = await ComercioModel.find({abierto: true, activado: true}).sort(({estrellas: -1}))
            .then((comercio)=>{
                return res.status(200).json(comercio);
            })
            .catch((error)=>{
                return res.status(404).json({msg: 'No se encontraron el comercio'});
            })
        }
        else if(filtro === TipoFiltroEnum.DESTACADOS){
            const comercios = await ComercioModel.find({estrellas: {$gt: 3}, activado: true}).sort(({estrellas: -1}))
            .then((comercio)=>{
                return res.status(200).json(comercio);
            })
            .catch((error)=>{
                return res.status(404).json({msg: 'No se encontraron el comercio'});
            })
        }
        else if(filtro === 'todos'){
            const comercios = await ComercioModel.find({activado: true}).sort(({estrellas: -1}))
            .then((comercio)=>{
                return res.status(200).json(comercio);
            })
            .catch((error)=>{
                return res.status(404).json({msg: 'No se encontraron el comercio'});
            })
        }
       
    }

    public async obtenerComerciosByUserId(req: any, res: Response){
        const {uid} = req.data;
        const comercios = await ComercioModel.find({usuarioId: uid})
        if(comercios.length > 0){
            return res.status(200).json(comercios[0]);
        }
        else{
            return res.status(404).json({msg: 'No se encontro el comercio'});
        }
        
    }

    public async actualizarComercio(req: any, res: Response){
        const {id} = req.params;
        await ComercioModel.updateOne({_id: id}, req.body).then((ok)=>{
            return res.status(200).json(ok);
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se pudo actualizar'});
        })      
    }

    public async activarComercio(req: any, res: Response){
        const {id} = req.params;
        await ComercioModel.updateOne({_id: id}, {activado: true}).then((ok)=>{
            return res.status(200).json(ok);
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se pudo actualizar'});
        })      
    }

    public async desactivarComercio(req: any, res: Response){
        const {id} = req.params;
        await ComercioModel.updateOne({_id: id}, {activado: false}).then((ok)=>{
            return res.status(200).json(ok);
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se pudo actualizar'});
        })      
    }

    public async calificarComercio(req: any, res: Response){
        const {id} = req.params;

        const {calificacion} = req.body;
        let punt;
        let cont;
        let estrellas;

        console.log(calificacion + " "+ id)

        await ComercioModel.findOne({_id: id}).then(async(comercio: any)=>{
            console.log(comercio)
            punt = comercio.puntuacion + calificacion
            cont = comercio.contadorCalificaciones ? comercio.contadorCalificaciones + 1 : 1
            estrellas = punt / cont;
            await ComercioModel.updateOne({_id: id}, {
                puntuacion: punt,
                contadorCalificaciones: cont,
                estrellas,
            })
            .then((com)=>{
                return res.status(200).json(com);
            })
            .catch((err)=>{
                return res.status(404).json({msg: 'No se pudo actualizar'});
            })

        })  
         
    }

    public async registrarVenta(req: any, res: Response){
        const {id} = req.params;
        const comercio = await ComercioModel.findOne({_id: id});
        if(comercio){
            const ventas = comercio.estadisticas.ventas ? comercio.estadisticas.ventas : 0;
            const actualizarVentas = await ComercioModel.updateOne({_id: id}, {estadisticas: {
                ventas: ventas + 1, 
            }})

            return res.status(200).json({msg: 'Ha completado un pedido'});
        }
        else{
            return res.status(404).json({msg: 'No se encontro el comercio'});
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
            return res.status(404).json({msg: 'No se encontro el comercio'});
        }
    }
}

export const comercioController = new ComercioController();