import { Router } from "express";
import { categoriasController } from "../controllers/categoriasController";


class CategoriaRoutes {
    router = Router();

    constructor(){
        this.config(); 
    }

    config(){
        this.router.post('/', categoriasController.crearCategoria);
        this.router.put('/:id', categoriasController.updateCategoria);
        this.router.get('/', categoriasController.getCategorias);
        this.router.delete('/:id', categoriasController.deleteCategoria);
        this.router.get('/:tipo', categoriasController.getCategoriasPorTipo);
    }
}

const categoriaRoutes = new CategoriaRoutes();
export default categoriaRoutes.router;