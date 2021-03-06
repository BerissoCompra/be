import { Router } from 'express';
import { productoController } from '../controllers/productoController';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import { publicidadController } from '../controllers/publicidadController';
import multer from '../libs/multer';
import { verifyToken } from '../middlewares/auth';

class PublicidadRoutes {
  public router: Router = Router();
  constructor() {
    this.config();
  }
  config(): void {
    //GET
    this.router.get(
      '/tipo/:tipo',
      [verifyToken],
      publicidadController.obtenerPublicidad,
    );
    this.router.get('/', [verifyToken], publicidadController.getAllPublicidad);

    //POST
    this.router.post(
      '/',
      [verifyToken, multer.single('imagen')],
      publicidadController.crearPublicidad,
    );
    this.router.post(
      '/alta',
      [verifyToken],
      publicidadController.agregarComerciosPublicidad,
    );
    this.router.post(
      '/baja',
      [verifyToken],
      publicidadController.eliminarComerciosPublicidad,
    );

    //DELTE
    this.router.delete(
      '/:id',
      [verifyToken],
      publicidadController.eliminarPublicidad,
    );
  }
}

const publicidadRoutes = new PublicidadRoutes();
export default publicidadRoutes.router;
