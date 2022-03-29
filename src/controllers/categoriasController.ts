
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
        await CategoriaModel.find({}).exec((err, categorias)=>{
            if(err)  return res.status(500).json({msg: 'Error al obtener'})
            return res.status(200).json(categorias)
        }); 
        
    }

    public async getCategoriasPorTipo(req: Request, res: Response){
        const {tipo} = req.params;
        await CategoriaModel.find({tipo}).exec((err, categorias)=>{
            if(err)  return res.status(500).json({msg: 'Error al obtener'})
            return res.status(200).json(categorias)
        }); 
    }

    public async getCategoriasById(req: Request, res: Response){
        const {id} = req.params;
        await CategoriaModel.findById(id).exec((err, categoria)=>{
            if(err)  return res.status(500).json({msg: 'Error al obtener'})
            if(!categoria) return res.status(404).json({msg: 'No se ha encontrado'})
            return res.status(200).json(categoria)
        }); 
        
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