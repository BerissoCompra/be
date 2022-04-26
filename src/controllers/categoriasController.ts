import { Request, Response } from 'express';
import CategoriaModel from '../models/Categorias';

class CategoriasController {
  public async crearCategoria(req: Request, res: Response) {
    const { descripcion, tipo } = req.body;
    try {
      const categoria = new CategoriaModel({
        descripcion,
        tipo,
      });

      const action = await categoria.save();
      if (action) {
        return res.status(201).json({ msg: 'Creado correctamente' });
      } else {
        return res.status(201).json({ msg: 'No se pudo crear' });
      }
    } catch (error) {
      return res.status(404).json({ msg: 'Debe completar todos los campos' });
    }
  }

  public async getCategorias(req: Request, res: Response) {
    await CategoriaModel.find({}).exec((err, categorias) => {
      if (err) return res.status(500).json({ msg: 'Error al obtener' });
      return res.status(200).json(categorias);
    });
  }

  public async getCategoriasPorTipo(req: Request, res: Response) {
    try {
      const { tipo } = req.params;
      const categorias = await CategoriaModel.find({ tipo });
      if(categorias.length > 0){
        return res.status(200).json(categorias);
      }
      else{
        return res.status(200).json([]);
      }
      
    } 
    catch (error) {
      return res
        .status(500)
        .json({ msg: 'Error al obtener las categorias', error });
    }
  }

  public async getCategoriasById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const categoria = await CategoriaModel.findById(id);

      if (!categoria) {
        return res.status(404).json({ msg: 'No se ha encontrado' });
      }

      return res.status(200).json(categoria);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: 'Error al obtener las categorias', error });
    }
  }

  public async updateCategoria(req: Request, res: Response) {
    const { id } = req.params;
    const { body } = req;
    console.log(body);
    try {
      console.log(body);
      if (!body.hasOwnProperty('descripcion') || !body.hasOwnProperty('tipo')) {
        return res
          .status(404)
          .json({ msg: 'Se deben ingresar las 2 propiedades para actualizar' });
      } else {
        const categoriaUpdated = await CategoriaModel.findByIdAndUpdate(
          id,
          body,
        );
        if (!categoriaUpdated) {
          return res.status(201).json({ msg: 'No se pudo actualizar' });
        } else {
          return res.status(201).json({ msg: 'Actualizado correctamente' });
        }
      }
    } catch (error) {
      return res.status(400).json({ msg: 'Hubo un error', error });
    }
  }

  public async deleteCategoria(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const categoria = await CategoriaModel.findByIdAndDelete(id);
      if (categoria) {
        return res.status(201).json({ msg: 'Eliminado correctamente' });
      } else {
        return res.status(201).json({ msg: 'No se pudo eliminar' });
      }
    } catch (error) {
      return res.status(404).json({ msg: 'Hubo un error al eliminar', error });
    }
  }
}

export const categoriasController = new CategoriasController();
