
import {Request, Response} from 'express';
import ComercioModel from '../models/Comercio';
import { TipoFiltroEnum } from '../models/enum/tipo-filtro.enum';
import Usuario from '../models/Usuario';
import fs from 'fs-extra';
import path from 'path';

class ComercioController{

    public async crearComercio(req: Request, res: Response){
        const comercio = new ComercioModel(req.body);
        const comercioGuardado = await comercio.save()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'El comercio no se pudo crear correctamente.'});
        });

        if(comercioGuardado){
            return res.status(200).json({msg: 'Comercio creado.'});
        }
        else{
            return res.status(500).json({msg: 'El comercio no se pudo crear correctamente.'});
        }
    }

    public async obtenerComercios(req: Request, res: Response){
        const comercios = await ComercioModel.find({})
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al obtener todos los comercios.'});
        });

        return res.status(200).json(comercios);
    }

    public async obtenerComerciosById(req: Request, res: Response){
        const {id} = req.params;
        const comercio = await ComercioModel.findById(id)
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al obtener comercio.'});
        });

        return res.status(200).json(comercio);
    }

    public async obtenerComerciosByFiltro(req: any, res: Response){
        const {filtro} = req.params;
                
        if(filtro === TipoFiltroEnum.ABIERTOS){
            const comercios = await ComercioModel.find({abierto: true, activado: true}).sort(({estrellas: -1}))
            .then()
            .catch((err: any)=> {
                console.log(err);
                return res.status(404).json({msg: 'Error al obtener comercios.'});
            });
            console.log(comercios)
            return res.status(200).json(comercios);
        }
        else if(filtro === TipoFiltroEnum.DESTACADOS){
            const comercios = await ComercioModel.find({estrellas: {$gt: 3}, activado: true}).sort(({estrellas: -1}))
            .then()
            .catch((err: any)=> {
                console.log(err);
                return res.status(404).json({msg: 'Error al obtener comercios.'});
            });

            return res.status(200).json(comercios);
        }
        else if(filtro === 'todos'){
            const comercios = await ComercioModel.find({activado: true}).sort(({estrellas: -1}))
            .then()
            .catch((err: any)=> {
                console.log(err);
                return res.status(404).json({msg: 'Error al obtener comercios.'});
            });
            
            return res.status(200).json(comercios);
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
        const comercio = await ComercioModel.findById(id)
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al actualizar producto.'});
        });

        if(comercio.imagenPath){
            await fs.unlink(path.resolve(comercio.imagenPath))
            .then(()=>{console.log("Imagen anterior eliminada")})
            .catch((err)=> console.log(err))
        }
        
        await ComercioModel.findByIdAndUpdate(id, req.body).then((ok)=>{
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
        const {total} = req.body;
        const comercio = await ComercioModel.findById(id)
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al registrar venta.'});
        });

        if(comercio){

            const ventas = comercio.estadisticas.ventas ? comercio.estadisticas.ventas : 0;
            const ingresoTotal = comercio.estadisticas.ingresosTotales ? comercio.estadisticas.ingresosTotales : 0;
            const deuda = comercio.estadisticas.deuda ? comercio.estadisticas.deuda : 0;
            const calculoDeuda = deuda + total;

            await ComercioModel.findByIdAndUpdate(id, {estadisticas: {
                ...comercio.estadisticas,
                ventas: ventas + 1, 
                ingresosTotales: ingresoTotal + total,
                deuda: calculoDeuda
            }})
            .then()
            .catch((err: any)=> {
                console.log(err);
                return res.status(404).json({msg: 'Error al registrar venta.'});
            });
            return res.status(200).json({msg: 'Ha completado un pedido'});
        }
        else{
            return res.status(404).json({msg: 'No se encontro el comercio'});
        }
    }

    public async registrarPago(req: any, res: Response){
        const {id} = req.params;
        const {total} = req.body;
        const comercio = await ComercioModel.findById(id)
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al regsitrar pago.'});
        });

        if(comercio){

            const deuda = comercio.estadisticas.deuda ? comercio.estadisticas.deuda : 0;
            const date = new Date();

            await ComercioModel.updateOne({_id: id}, {estadisticas: {
                ...comercio.estadisticas,
                deuda: (deuda - total),
                ultimoPago: new Date(),
                proximoPago: date.setDate(date.getDate() + 7)
            }})
            .then()
            .catch((err: any)=> {
                console.log(err);
                return res.status(404).json({msg: 'Error al regsitrar pago.'});
            });

            return res.status(200).json({msg: 'Pago Registrado'});
        }
        else{
            return res.status(404).json({msg: 'No se encontro el comercio'});
        }
    }

    public async verificarComercio(req: any, res: Response){
        const {id} = req.params;
        const comercio = await ComercioModel.findById(id)
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al verificar comercio.'});
        });

        if(comercio){
            if(comercio.abierto){
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

    public async eliminarComercio(req: any, res: Response){
        const {id} = req.params;
        const comercio = await ComercioModel.findById(id)
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al eliminar comercio.'});
        });

        if(comercio){
            await fs.unlink(path.resolve(comercio.imagenPath))
            await ComercioModel.findByIdAndDelete(id)
            .then(async()=>{
                await Usuario.findByIdAndDelete(comercio.usuarioId)
                .then(()=>{
                    return res.status(200).json({msg: 'Eliminado'});
                })
                .catch((err)=>{
                    console.log(err)
                    return res.status(404).json({msg: 'No se encontro el comercio'});
                })
            })
            .catch((err)=>{
                console.log(err)
                return res.status(404).json({msg: 'No se encontro el comercio'});
            }) 
        }
        else{
            return res.status(404).json({msg: 'No se encontro el comercio'});
        }
    }
}

export const comercioController = new ComercioController();