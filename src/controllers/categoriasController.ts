
import {Request, Response} from 'express';
import CategoriaModel from '../models/Categorias';


class CategoriasController{

    public async crearCategoria(req: Request, res: Response){
        const {body} = req;
        if(body?.descripcion && body?.tipo){
            const categoria = new CategoriaModel(body);
            const action = await categoria.save();
            if(action){
                return res.status(201).json({msg: 'Creado correctamente'});
            }
            else{
                return res.status(201).json({msg: 'No se pudo crear'});
            }
        }
        else{
            return res.status(404).json({msg: 'Debe completar todos los campos'});
        }
   
    }

    public async getCategorias(req: Request, res: Response){
        const categorias = await CategoriaModel.find({});
        return res.status(200).json(categorias)
    }

    public async getCategoriasPorTipo(req: Request, res: Response){
        const {tipo} = req.params;
        const categorias = await CategoriaModel.find({tipo});
        return res.status(200).json(categorias)
    }

    public async getCategoriasById(req: Request, res: Response){
        const {id} = req.params;
        const categoria = await CategoriaModel.findById(id);
        if(categoria){
            return res.status(200).json(categoria)
        }
        else{
            return res.status(404).json({msg: 'No se encontro categoría'})
        } 
        
    }

    public async updateCategoria(req: Request, res: Response){
        const {id} = req.params;
        const {body} = req;
        const categoria = await CategoriaModel.findByIdAndUpdate(id, body);
        if(categoria){
            return res.status(201).json({msg: 'Actualizado correctamente'});
        }
        else{
            return res.status(201).json({msg: 'No se pudo actualizar'});
        }
    }

    public async deleteCategoria(req: Request, res: Response){
        const {id} = req.params;
        const categoria = await CategoriaModel.findByIdAndDelete(id);
        if(categoria){
            return res.status(201).json({msg: 'Eliminado correctamente'});
        }
        else{
            return res.status(201).json({msg: 'No se pudo eliminar'});
        }
    }
}

export const categoriasController = new CategoriasController();