import { NextFunction, Router } from 'express';
import { comercioController } from '../controllers/comercioController';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import multer from '../libs/multer';
import { verifyToken } from '../middlewares/auth';

class ComerciosRoutes {
  public router: Router = Router();
  constructor() {
    this.config();
  }
  config(): void {
    //TODO Ver proximamente el middleware
    // GET
    this.router.get('/', comercioController.obtenerComercios);
    this.router.get('/search/:consulta', comercioController.searchComercio);
    this.router.get(
      '/obtener',
      [verifyToken],
      comercioController.obtenerComerciosByUserId,
    );
    this.router.get(
      '/filtrar/:filtro',
      [verifyToken],
      comercioController.obtenerComerciosByFiltro,
    );
    this.router.get(
      '/:id',
      [verifyToken],
      comercioController.obtenerComerciosById,
    );
    this.router.get(
      '/:id/usuario',
      [verifyToken],
      comercioController.obtenerResponsableById,
    );
    this.router.get(
      '/verificar/:id',
      [verifyToken],
      comercioController.verificarComercio,
    );
    this.router.get(
      '/cierrecaja/:id',
      [verifyToken],
      comercioController.obtenerCierreDeCaja,
    );
    this.router.get(
      '/cierrecaja/:id/cerrar',
      [verifyToken],
      comercioController.cerrarCaja,
    );
    this.router.get(
      '/cierrecaja/:id/ticket',
      [verifyToken],
      comercioController.cerrarCajaTicket,
    );
    this.router.get(
      '/comentarios/:id',
      [verifyToken],
      comercioController.obtenerComentariosByComercioId,
    );

    //POST
    this.router.post('/new', comercioController.crearComercio);

    //PUT
    this.router.put(
      '/:id',
      [verifyToken, multer.single('imagen')],
      comercioController.actualizarComercio,
    );
    this.router.put(
      '/:id/horarios',
      [verifyToken],
      comercioController.actualizarHorarioComercio,
    );
    this.router.put(
      '/:id/cuenta',
      [verifyToken],
      comercioController.actualizarCuentaComercio,
    );
    this.router.put(
      '/:id/activar',
      [verifyToken],
      comercioController.activarComercio,
    );
    this.router.put(
      '/:id/registrarventa',
      [verifyToken],
      comercioController.registrarVenta,
    );
    this.router.put(
      '/:id/registrarpago',
      [verifyToken],
      comercioController.registrarPago,
    );
    this.router.put(
      '/:id/desactivar',
      [verifyToken],
      comercioController.desactivarComercio,
    );
    this.router.put('/calificar/:id', comercioController.calificarComercio);
    this.router.put(
      '/:id/abrir',
      [verifyToken],
      comercioController.abrirComercio,
    );
    this.router.put(
      '/:id/cerrar',
      [verifyToken],
      comercioController.cerrarComercio,
    );

    //DELETE
    this.router.delete(
      '/:id',
      [verifyToken],
      comercioController.eliminarComercio,
    );
  }
}

const comerciosRoutes = new ComerciosRoutes();
export default comerciosRoutes.router;
