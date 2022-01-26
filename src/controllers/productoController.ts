
//import {connect} from '../database';
import {Request, Response} from 'express';
import ProductoModel from '../models/Producto';

class ProductoController{
     
    public async nuevoProducto(req: any, res: Response): Promise<any>{
        const producto = new ProductoModel(req.body);
        const productoGuaradado = await producto.save();
        if(productoGuaradado){
            return res.status(200).json({ok: 'Comercio creado.'});
        }
        else{
            return res.status(500).json({err: 'El comercio no se pudo crear correctamente.'});
        }
    }
    
    public async elimiarProducto(req: any, res: Response): Promise<any>{
        const {id} = req.params;
        const producto = await ProductoModel.deleteOne({_id: id});
        if(producto){
            return res.status(200).json({ok: 'Producto eliminado.'});
        }
        else{
            return res.status(500).json({err: 'El producto no se pudo eliminar.'});
        }
    }

    public async actualizarProducto(req: any, res: Response): Promise<any>{
        const {id} = req.params;
        const producto = await ProductoModel.updateOne({_id: id}, req.body);
        if(producto){
            return res.status(200).json({ok: 'Producto actualizado.'});
        }
        else{
            return res.status(500).json({err: 'El producto no se puede actualizar.'});
        }
    }

    public async obtenerProductosPorComercio(req: any, res: Response): Promise<any>{
        const {id} = req.params;
        const productos = await ProductoModel.find({comercioId: id});
        if(productos.length > 0){
            return res.status(200).json(productos);
        }
        else{
            return res.status(404).json({err: 'No se encontraron productos'});
        }

         
    }


}

export const productoController = new ProductoController();