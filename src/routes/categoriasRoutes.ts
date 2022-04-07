import { Router } from "express";
import { categoriasController } from "../controllers/categoriasController";
import { verifyToken } from "../middlewares/auth";


class CategoriaRoutes {
    router = Router();

    constructor(){
        this.config(); 
    }

    config(){
        this.router.post('/', [verifyToken] ,categoriasController.crearCategoria);
        this.router.put('/:id', [verifyToken] ,categoriasController.updateCategoria);
        this.router.get('/', [verifyToken] ,categoriasController.getCategorias);
        this.router.delete('/:id', verifyToken ,categoriasController.deleteCategoria);
        this.router.get('/:tipo', [verifyToken] ,categoriasController.getCategoriasPorTipo);
    }

}

const categoriaRoutes = new CategoriaRoutes();
export default categoriaRoutes.router;