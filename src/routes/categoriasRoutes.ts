import { Router } from 'express';
import { categoriasController } from '../controllers/categoriasController';
import { verifyToken } from '../middlewares/auth';

class CategoriaRoutes {
  router = Router();

  constructor() {
    this.config();
  }

  config() {
    //POST
    this.router.post('/', categoriasController.crearCategoria);

    //GET
    this.router.get('/', categoriasController.getCategorias);
    this.router.get('/:id', categoriasController.getCategoriasById);
    this.router.get('/:tipo', categoriasController.getCategoriasPorTipo);

    //PUT
    this.router.put('/:id', categoriasController.updateCategoria);

    //DELETE
    this.router.delete('/:id', categoriasController.deleteCategoria);
  }
}

const categoriaRoutes = new CategoriaRoutes();
export default categoriaRoutes.router;
