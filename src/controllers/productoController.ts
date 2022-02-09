
//import {connect} from '../database';
import {Request, Response} from 'express';
import ProductoModel from '../models/Producto';
import fs from 'fs-extra';
import path from 'path';

class ProductoController{
     
    public async nuevoProducto(req: any, res: Response): Promise<any>{
        const {producto} = req.body;
        const prod = new ProductoModel(producto);
        const productoGuaradado = await prod.save()
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al crear producto.'});
        });

        if(productoGuaradado){
            return res.status(200).json({msg: 'Producto creado.'});
        }
        else{
            return res.status(404).json({msg: 'Error al crear producto.'});
        }
    }
    
    public async elimiarProducto(req: any, res: Response): Promise<any>{
        const {id} = req.params;
        const producto = await ProductoModel.findByIdAndRemove(id)
        .catch((err: any)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al eliminar producto.'});
        });

        if(producto){
            await fs.unlink(path.resolve(producto.imagenPath))
            .then(()=>{
                return res.status(200).json({msg: 'Producto eliminado.'});
            })
            .catch((err)=>{
                console.log(err)
                return res.status(200).json({msg: 'Producto eliminado.'});
            })
        }
        else{
            return res.status(404).json({msg: 'El producto no se pudo eliminar.'});
        }
    }

    public async actualizarProducto(req: any, res: Response): Promise<any>{
        const {id} = req.params;
        const obtenerProducto = await ProductoModel.findById(id);
        
        //Elimino la imagen anterior
        if(obtenerProducto.imagenPath){
            await fs.unlink(path.resolve(obtenerProducto.imagenPath))
            .then(()=>{console.log("Img eliminada")})
            .catch((err)=>{console.log(err)})
        }

        const producto = await ProductoModel.findByIdAndUpdate(id, req.body)
        .catch((err)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al actualizar.'});
        });

        if(producto){
            return res.status(200).json({msg: 'Producto actualizado.'});
        }
        else{
            return res.status(404).json({msg: 'El producto no se puede actualizar.'});
        }
    }

    public async obtenerProductosPorComercio(req: any, res: Response): Promise<any>{
        const {id} = req.params;
        const productos = await ProductoModel.find({comercioId: id})
        .catch((err)=> {
            console.log(err);
            return res.status(404).json({msg: 'Error al obtener productos.'});
        });

        if(productos){
            return res.status(200).json(productos);
        }
        else{
            return res.status(404).json({msg: 'No se encontraron productos'});
        }
    }

}

export const productoController = new ProductoController();