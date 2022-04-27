import { NextFunction, Router } from 'express';
import { serviciosController } from '../controllers/serviciosController';
// import keys from '../keys';
// import jwt from 'jsonwebtoken';
// import multer from '../libs/multer';
// import { verifyToken } from '../middlewares/auth';

class ServiciosRoutes {
  public router: Router = Router();
  constructor() {
    this.config();
  }
  config(): void {
    //TODO Ver proximamente el middleware
    // GET

    this.router.get('/', serviciosController.obtenerServicios);
    this.router.get('/:id', serviciosController.obtenerServicioById);

    //POST

    this.router.post('/crear', serviciosController.crearServicio);

    //PUT

    this.router.put('/:id', serviciosController.actualizarServicioById);
    this.router.put('/:id/activar', serviciosController.activarServicio);
    this.router.put('/:id/desactivar', serviciosController.desactivarServicio);

    //DELETE

    this.router.delete('/:id', serviciosController.deleteServicio);
  }
}

const serviciosRoutes = new ServiciosRoutes();
export default serviciosRoutes.router;
