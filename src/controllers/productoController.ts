//import {connect} from '../database';
import { Request, Response } from 'express';
import ProductoModel from '../models/Producto';
import fs from 'fs-extra';
import path from 'path';

class ProductoController {
  public async nuevoProducto(req: Request, res: Response): Promise<any> {
    try {
      const { producto } = req.body;
      const prod = new ProductoModel(producto);
      const productoGuaradado = await prod.save();

      if (productoGuaradado) {
        return res.status(200).json({ msg: 'Producto creado.' });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(404).json({ msg: 'Error al crear producto.' });
    }
  }

  public async elimiarProducto(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const producto = await ProductoModel.findByIdAndRemove(id);
      if (producto) {
        await fs.unlink(path.resolve(producto.imagenPath)).then(() => {
          return res.status(200).json({ msg: 'Producto eliminado.' });
        });
      }
    } catch (error: any) {
      console.log(error);
      return res.status(404).json({ msg: 'Error al eliminar producto.' });
    }
  }

  public async actualizarProducto(req: any, res: Response): Promise<any> {
    const { id } = req.params;
    const obtenerProducto = await ProductoModel.findById(id);

    //Elimino la imagen anterior
    if (
      obtenerProducto.imagenPath &&
      obtenerProducto.imagenPath != req.body.imagenPath
    ) {
      await fs
        .unlink(path.resolve(obtenerProducto.imagenPath))
        .then(() => {
          console.log('Img eliminada');
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const producto = await ProductoModel.findByIdAndUpdate(id, req.body).catch(
      (err) => {
        console.log(err);
        return res.status(404).json({ msg: 'Error al actualizar.' });
      },
    );

    if (producto) {
      return res.status(200).json({ msg: 'Producto actualizado.' });
    } else {
      return res
        .status(404)
        .json({ msg: 'El producto no se puede actualizar.' });
    }
  }

  public async activarProducto(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await ProductoModel.findByIdAndUpdate(id, { activo: true }).then(() => {
        return res.status(202).json({ msg: 'Activado.' });
      });
    } catch (error: any) {
      console.log(error);
      return res.status(404).json({ msg: 'El producto no se puede activar.' });
    }
  }

  public async desactivarProducto(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await ProductoModel.findByIdAndUpdate(id, { activo: false }).then(() => {
        return res.status(202).json({ msg: 'Desactivado.' });
      });
    } catch (error: any) {
      console.log(error);
      return res
        .status(404)
        .json({ msg: 'El producto no se puede desactivar.' });
    }
  }

  public async obtenerProductosPorComercio(
    req: Request,
    res: Response,
  ): Promise<any> {
    try {
      const { id } = req.params;
      const productos = await ProductoModel.find({ comercioId: id });

      if (productos) {
        return res.status(200).json(productos);
      }
    } catch (error: any) {
      console.log(error);
      return res.status(404).json({ msg: 'Error al obtener productos.' });
    }
  }

  public async obtenerProductosEnDescuento(
    req: Request,
    res: Response,
  ): Promise<any> {
    try {
      const { id } = req.params;
      const productos = await ProductoModel.find({ descuento: {$gt: 1} });
      return res.status(200).json(productos);
      
    } catch (error: any) {
      console.log(error);
      return res.status(404).json({ msg: 'Error al obtener productos.' });
    }
  }
}

export const productoController = new ProductoController();
