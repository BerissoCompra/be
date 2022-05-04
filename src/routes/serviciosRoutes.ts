import { NextFunction, Router } from 'express';
import { serviciosController } from '../controllers/serviciosController';
import { verifyToken } from '../middlewares/auth';

class ServiciosRoutes {
  public router: Router = Router();
  constructor() {
    this.config();
  }
  config(): void {
    //TODO Ver proximamente el middleware
    // GET

    this.router.get('/', serviciosController.obtenerServicios);
    this.router.get(
      '/:id',
      [verifyToken],
      serviciosController.obtenerServicioById,
    );

    //POST

    this.router.post(
      '/crear',
      [verifyToken],
      serviciosController.crearServicio,
    );

    //PUT

    this.router.put(
      '/:id',
      [verifyToken],
      serviciosController.actualizarServicioById,
    );
    this.router.put(
      '/:id/activar',
      [verifyToken],
      serviciosController.activarServicio,
    );
    this.router.put(
      '/:id/desactivar',
      [verifyToken],
      serviciosController.desactivarServicio,
    );

    //DELETE

    this.router.delete(
      '/:id',
      [verifyToken],
      serviciosController.deleteServicio,
    );
  }
}

const serviciosRoutes = new ServiciosRoutes();
export default serviciosRoutes.router;
