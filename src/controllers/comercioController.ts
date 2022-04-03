
import {Request, Response} from 'express';
import ComercioModel from '../models/Comercio';
import { TipoFiltroEnum } from '../models/enum/tipo-filtro.enum';
import Usuario from '../models/Usuario';
import fs from 'fs-extra';
import path from 'path';
import Comercio from '../models/Comercio';
import Producto from '../models/Producto';
import Comentarios from '../models/Comentarios';
import Cliente from '../models/Cliente';
import Pedido from '../models/Pedido';
import pdf, { CreateOptions } from "html-pdf";
import { crearHtmlCierreCaja } from '../libs/generatePdf';


class ComercioController{

    public async crearComercio(req: Request, res: Response){
        const comercio = new ComercioModel({
            ...req.body,
            imagen: 'https://www.uifrommars.com/wp-content/uploads/2018/08/crear-paleta-colores-diseno-ui.jpg'
        });
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

        if(!id){
            return res.status(404)
        } 

        const comercio = await ComercioModel.findById(id)
        .then()
        .catch((err: any)=> { 
            console.log(err);
            return res.status(404).json({msg: 'Error al obtener comercio.'});
        });
        const productos = await Producto.find({comercioId: comercio._id})
        return res.status(200).json({productos, comercio});
    }  

    public async obtenerResponsableById(req: Request, res: Response){
        const {id} = req.params;
        const comercio = await Comercio.findById(id)
        .then()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al obtener responsable.'});
        });

        if(comercio?.usuarioId){
            const usuario = await Usuario.findById(comercio.usuarioId)
            .then()
            .catch((err: any)=> {
                console.log(err);
                return res.status(404).json({msg: 'Error al obtener responsable.'});
            });
            const {password, ...rest} = usuario
            return res.status(200).json(rest);
        }
        else{
            return res.status(404).json({msg: 'Error al obtener responsable.'});
        }
        
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

    public async searchComercio(req: any, res: Response){
        const {consulta} = req.params;
        console.log(consulta)
        await Comercio.createIndexes([{"nombre": 1}]);
        if(consulta){
            const comercio = await Comercio.find({$text:{$search:consulta}, activado: true})
            return res.status(200).json(comercio);
        }
        else{
            return res.status(404).json({msg: 'No se econtro el comercio'});
        }   
    }

    public async actualizarComercio(req: any, res: Response){
        const {id} = req.params;
        const {file, body} = req;
        const {estadisticas, cuenta, ...rest} = body;
        const comercio = await ComercioModel.findById(id)
        if(file){
            const fileName = file.filename;
            if(comercio?.imagenPath){
                await fs.unlink(path.resolve(comercio.imagenPath))
                .then(async()=>{
                    await ComercioModel.findByIdAndUpdate(id, 
                        {
                            ...rest,
                            imagenPath: file.path,
                            imagen: `http://192.168.0.229:3000/uploads/${fileName}`
                        }).then((ok)=>{
                        return res.status(200).json({msg: 'Comercio Actualizado'}); 
                    })
                    .catch((err)=>{
                        return res.status(404).json({msg: 'No se pudo actualizar'});
                    })
                })
                .catch(async(err)=> {
                    await ComercioModel.findByIdAndUpdate(id, 
                        {
                            ...rest,
                            imagenPath: file.path,
                            imagen: `http://192.168.0.229:3000/uploads/${fileName}`
                        }).then((ok)=>{
                        return res.status(200).json({msg: 'Comercio Actualizado'}); 
                    })
                    .catch((err)=>{
                        return res.status(404).json({msg: 'No se pudo actualizar'});
                    })
                })
            }
            else{
                await ComercioModel.findByIdAndUpdate(id, 
                    {
                        ...rest,
                        imagenPath: file.path,
                        imagen: `http://192.168.0.229:3000/uploads/${fileName}`
                    }).then((ok)=>{
                    return res.status(200).json({msg: 'Comercio Actualizado'}); 
                })
                .catch((err)=>{
                    return res.status(404).json({msg: 'No se pudo actualizar'});
                })
            }
        }
        else{
            console.log("No trae file")
            await ComercioModel.findByIdAndUpdate(id, rest).then((ok)=>{
                return res.status(200).json({msg: 'Comercio Actualizado'}); 
            })
            .catch((err)=>{
                return res.status(404).json({msg: 'No se pudo actualizar'});
            }) 
        }
    }

    public async actualizarHorarioComercio(req: any, res: Response){
        const {id} = req.params;
        const {body} = req;
        await ComercioModel.findByIdAndUpdate(id, body).then((ok)=>{
            return res.status(200).json({msg: 'Comercio Actualizado'}); 
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se pudo actualizar'});
        }) 
    }

    public async actualizarCuentaComercio(req: any, res: Response){
        const {id} = req.params;
        const {body} = req;
        await ComercioModel.findByIdAndUpdate(id, body).then((ok)=>{
            return res.status(200).json({msg: 'Comercio Actualizado'}); 
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

    public async abrirComercio(req: any, res: Response){
        const {id} = req.params;
        await ComercioModel.updateOne({_id: id}, {abierto: true}).then((ok)=>{
            return res.status(200).json(ok);
        })
        .catch((err)=>{
            return res.status(404).json({msg: 'No se pudo actualizar'});
        })      
    }

    public async cerrarComercio(req: any, res: Response){
        const {id} = req.params;
        await ComercioModel.updateOne({_id: id}, {abierto: false}).then((ok)=>{
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

    public async obtenerComentariosByComercioId(req: any, res: Response){
        const {id} = req.params;
        const comentarios = await Comentarios.find({comercioId: id}).limit(10).sort(({createdAt: -1}));
        let resultadoComentarios: any[] = [];

        if(comentarios.length > 0){
            
            await Promise.all (
                comentarios.map(async(comentario)=>{
                    const usuario = await Cliente.findById(comentario.usuarioId);
                    if(usuario){
                        resultadoComentarios.push({
                            comentario: comentario.comentario,
                            puntuacion: comentario.puntuacion,
                            usuario: usuario.nombre
                        })
                    }
                })
            )

            
        }

        return res.status(200).json(resultadoComentarios)

    }

    public async calificarComercio(req: any, res: Response){
        const {id} = req.params;
        const {calificacion, comentario, usuarioId} = req.body;

        let punt;
        let cont;
        let estrellas;

        if(!id) return res.status(404).json({msg: 'ID Inválido'})

        const comercio = await ComercioModel.findById(id);

        if(!comercio) return res.status(404).json({msg: 'No se encontro el comercio'})

        punt = comercio.puntuacion + calificacion
        cont = comercio.contadorCalificaciones ? comercio.contadorCalificaciones + 1 : 1
        estrellas = Math.round(punt / cont);

        const comercioActualizado = await ComercioModel.findByIdAndUpdate(id, {
            puntuacion: punt,
            contadorCalificaciones: cont,
            estrellas,
        })

        if(comercioActualizado){
            if(comentario){
                const comment = new Comentarios({
                    comercioId: id,
                    usuarioId,
                    comentario,
                    puntuacion: calificacion
                })
                const saveComentario = await comment.save()
            }

            return res.status(200).json(comercioActualizado);
        
        }
        else{
            return res.status(404).json({msg: 'No se pudo calificar el comercio'})
        }
         
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
            const mes = date.getMonth() + 1;
            const year = date.getFullYear();
            const dateFinal = new Date(year, mes, 10)

            await ComercioModel.updateOne({_id: id}, {estadisticas: {
                ...comercio.estadisticas,
                deuda: 0,
                ultimoPago: new Date(),
                proximoPago: dateFinal
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
            if(comercio.imagenPath){
                await fs.unlink(path.resolve(comercio.imagenPath))
                .then()
                .catch((err)=>{
                    console.log(err)
                })
            }

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

    public async cerrarCaja(req: any, res: Response){
        const {id} = req.params;
        if(!id) return res.status(404).json({msg: 'No se ha podido realizar el cierre'})
        const pedidos = await Pedido.find({comercioId: id});
        await Promise.all(
            pedidos.map(async(pedido)=>{
                if(pedido._id){
                    await Pedido.findByIdAndDelete(pedido._id);
                } 
            }) 
        )

        return res.status(200).json({msg: 'Cierre de caja realizado correctamente'})
    }

    public async obtenerCierreDeCaja(req: any, res: Response){
        const {id} = req.params;
        const pedidos = await Pedido.find({comercioId: id});

        if(pedidos){
            const cantidadPedidos: number = pedidos.length;
            let totalIngresoDiario: number = 0;
            let pedidosDelDia: any[] = [];
            await Promise.all(
                pedidos.map(async(pedido)=>{
                    if(pedido._id){
                        const usuario = await Cliente.findById(pedido.clienteId)
                        totalIngresoDiario = totalIngresoDiario + pedido.total;
                        pedidosDelDia.push({
                            pedidoId: pedido.idPedido,
                            pagoEfectivo: pedido.configuracion.pagoEfectivo,
                            pagoDigital: pedido.configuracion.pagoDigital,
                            items: pedido.items,
                            total: pedido.total,
                            fecha: pedido.createdAt,
                            nombreCliente: usuario.nombre,
                        })
                    } 
                }) 
            )

            return res.status(200).json({
                cantidadPedidos,
                totalIngresoDiario,
                pedidosDelDia
            })
        }
        else{
            return res.status(404).json({
                msg: 'Error al cerrar la caja',
            })
        }
    }

    public async cerrarCajaTicket(req: any, res: Response){
        const {id} = req.params;
        console.log(id)
        const pedidos = await Pedido.find({comercioId: id});

        if(pedidos){
            const cantidadPedidos: number = pedidos.length;
            let totalIngresoDiario: number = 0;
            let pedidosDelDia: any[] = [];
            await Promise.all(
                pedidos.map(async(pedido)=>{
                    if(pedido._id){
                        //await Pedido.findByIdAndDelete(pedido._id);
                        const usuario = await Cliente.findById(pedido.clienteId)
                        totalIngresoDiario = totalIngresoDiario + pedido.total;
                        pedidosDelDia.push({
                            pedidoId: pedido.idPedido,
                            pagoEfectivo: pedido.configuracion.pagoEfectivo,
                            pagoDigital: pedido.configuracion.pagoDigital,
                            items: pedido.items,
                            total: pedido.total,
                            fecha: pedido.createdAt,
                            nombreCliente: usuario.nombre,
                        })
                    } 
                }) 
            ) 

            const options: CreateOptions = {
                "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                "orientation": "portrait", // portrait or landscape
            }

            const content = crearHtmlCierreCaja(totalIngresoDiario,cantidadPedidos,pedidosDelDia);

            pdf.create(content, options).toStream((err: any, stream) => {
                if (err) {
                    console.log("Err")
                    return res.end(err.stack)
                }
                res.setHeader('Content-type', 'application/pdf')
                return stream.pipe(res)
               
            })
        }
        else{
            return res.status(404).json({
                msg: 'Error al cerrar la caja',
            })
        }
    }
}

export const comercioController = new ComercioController();