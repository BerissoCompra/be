import {Request, Response} from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import Pedido from '../models/Pedido';
import Comercio from '../models/Comercio';

class PedidosController{

    public async crearPedido(req: Request, res: Response){
        const {id} = req.params;
        const pedido = new Pedido(req.body);
        const pedidoCreado = await pedido.save();
        if(pedidoCreado){
            return res.status(200).json({_id: pedidoCreado._id});
        }
        else{
            return res.status(500).json({err: 'El pedido no se pudo crear correctamente.'});
        }
    }

    public async obtenerPedidosId(req: Request, res: Response){
        const {id} = req.params;
        const pedido = await Pedido.findById(id)
        .then()
        .catch((err)=>{
            console.log(err)
            return res.status(404).json({ok: 'No se encontraron pedidos'});
        })
        if(pedido){
            let pedidoResponse: any = {};
            const {comercioId} = pedido;
            const comercio = await Comercio.findById(comercioId);   
            pedidoResponse = {pedido, comercio} 
            return res.status(200).json(pedidoResponse);
        }
        else{
            return res.status(404).json({ok: 'No se encontraron pedidos'});
        }
    }

    public async obtenerPedidosCliente(req: Request, res: Response){
        const {id} = req.params;
        const pedidos: any[] = await Pedido.find({clienteId: id})
        if(pedidos){

            let pedidosResponse: any[] = [];

            await Promise.all(
                pedidos.map(async(pedido)=>{
                    const comercioId = pedido.comercioId;
                    const comercio = await Comercio.findById(comercioId);
                    const pedidoCompleto = {...pedido._doc, comercio};
                    pedidosResponse.push(pedidoCompleto);
                })
            )

           return res.status(200).json(pedidosResponse);
        }
        else{
            return res.status(404).json({ok: 'No se encontraron pedidos'});
        }
    }

    public async obtenerPedidosComercios(req: Request, res: Response){
        const {id, estado} = req.params;
        const pedidos = await Pedido.find({comercioId: id, estado: estado})
        if(pedidos){
            return res.status(200).json(pedidos);
        }
        else{
            return res.status(404).json({ok: 'No se encontraron pedidos'});
        }
    }

    public async actualizarPedido(req: Request, res: Response){
        const {id} = req.params;
        const pedidoActualizado = await Pedido.updateOne({_id: id}, req.body);
        if(pedidoActualizado){
            return res.status(200).json({ok: 'Pedido actualizado.'});
        }
        else{
            return res.status(500).json({err: 'El pedido no se pudo crear correctamente.'});
        }
    }

    public async eliminarPedido(req: Request, res: Response){
        const {id} = req.params;
        const pedidoEliminado = await Pedido.deleteOne({_id: id})
        .then((re)=>{
            return res.status(200).json({msg: 'Pedido eliminado.'});
        })
        .catch((error)=>{
            return res.status(500).json({msg: 'El pedido no se pudo eliminar correctamente.'});
        })
    }

 
}

export const pedidosController = new PedidosController();