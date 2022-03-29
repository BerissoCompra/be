import { Router } from "express";
import { categoriasController } from "../controllers/categoriasController";


class CategoriaRoutes {
    router = Router();

    constructor(){
        this.config(); 
    }

    config(){
        this.router.post('/', categoriasController.crearCategoria);
        this.router.put('/:id', [this.test] ,categoriasController.updateCategoria);
        this.router.get('/', categoriasController.getCategorias);
        this.router.delete('/:id', categoriasController.deleteCategoria);
        this.router.get('/:tipo', categoriasController.getCategoriasPorTipo);
    }

    test(req: any, res: any){
        console.log("Id incorrecto")
        if(req.params.id == 0){
            console.log("Id incorrecto")
            throw new Error('El id es incorrecto')
        }
    }
}

const categoriaRoutes = new CategoriaRoutes();
export default categoriaRoutes.router;