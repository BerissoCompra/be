import { Router } from 'express';
import { productoController } from '../controllers/productoController';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth';

class ProductosRoutes {
  public router: Router = Router();
  constructor() {
    this.config();
  }
  config(): void {
    //this.router.get('/:id', [verifyToken], productoController.obtenerProductos);

    //GET
    this.router.get(
      '/productos/:id',
      productoController.obtenerProductosPorComercio,
    );
    this.router.get(
      '/productos/descuentos/obtener',
      productoController.obtenerProductosEnDescuento,
    );

    //POST
    this.router.post(
      '/productos/nuevo',
      [verifyToken],
      productoController.nuevoProducto,
    );

    //PUT
    this.router.put(
      '/productos/:id',
      [verifyToken],
      productoController.actualizarProducto,
    );
    this.router.put(
      '/productos/:id/activar',
      [verifyToken],
      productoController.activarProducto,
    );
    this.router.put(
      '/productos/:id/desactivar',
      [verifyToken],
      productoController.desactivarProducto,
    );

    //DELETE
    this.router.delete(
      '/productos/:id',
      [verifyToken],
      productoController.elimiarProducto,
    );
  }
}

const productosRoutes = new ProductosRoutes();
export default productosRoutes.router;
