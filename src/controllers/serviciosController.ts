import { Request, Response } from 'express';
import { RolesEnum } from '../models/enum/roles';
import { montoPorCategoria, TiposCategoriasEnum } from '../models/enum/tipo-categorias';
import ServicioModel from '../models/Servicio';
import Usuario from '../models/Usuario';

class ServiciosController {
  public async crearServicio(req: any, res: Response) {
    try {
      const { uid } = req.data;

      const usuario = await Usuario.findByIdAndUpdate(uid, {
        rol: RolesEnum.SERVICIO,
      });

      let monto = 0;

      switch (req.body?.tipo) {
        case TiposCategoriasEnum.GASTRONOMICOS:
          monto = 0;
          break;
          case TiposCategoriasEnum.EMPRENDEDORES:
            monto = 1200;
            break;
            case TiposCategoriasEnum.PROFESIONALES:
              monto = 1500;
              break;
              case TiposCategoriasEnum.SERVICIOS:
                monto = 1200;
                break;
        default:
          monto = 0;
          break;
      }

      const usuarioId = uid;

      console.log(`El tipo del servicio es ${req.body?.tipo} y su monto ${monto}`)

      const servicio = new ServicioModel({
        ...req.body,
        usuarioId,
        monto,
        imagen:
          'https://www.uifrommars.com/wp-content/uploads/2018/08/crear-paleta-colores-diseno-ui.jpg',
      });
      //   console.log(servicio);
      await servicio.save();
      return res
        .status(200)
        .json({ msg: 'Servicio creado correctamente', id: servicio._id });
    } catch (error) {
      return res.status(400).json({ msg: 'Hubo un error', error });
      console.error(error);
    }
  }

  public async obtenerServicios(req: Request, res: Response) {
    try {
      const servicios = await ServicioModel.find({});

      return res
        .status(200)
        .json({ msg: 'Servicios obtenidos de manera correcta', servicios });
    } catch (error) {
      return res.status(400).json({ msg: 'Hubo un error', error });
      console.error(error);
    }
  }

  public async obtenerServicioById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ msg: 'No existe ese id' });

      const servicio = await ServicioModel.findById(id);

      return res
        .status(200)
        .json({ msg: 'Servicios obtenidos de manera correcta', servicio });
    } catch (error) {
      return res.status(400).json({ msg: 'Hubo un error', error });
      console.error(error);
    }
  }

  public async obtenerServicioByCategoria(req: Request, res: Response) {
    try {
      const { categoria } = req.params;
      if (!categoria) return res.status(400).json({ msg: 'No existe esa categoria' });

      const servicios = await ServicioModel.find({categoria});

      return res
        .status(200)
        .json({ msg: 'Servicios obtenidos de manera correcta', servicios });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ msg: 'Hubo un error', error });
    }
  }

  public async actualizarServicioById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;
      if (!id) return res.status(400).json({ msg: 'No existe ese id' });

      const servicioUpdated = await ServicioModel.findByIdAndUpdate(id, body);

      return res.status(200).json({
        msg: 'Servicio actualizado de manera correcta',
      });
    } catch (error) {
      return res.status(400).json({ msg: 'Hubo un error', error });
      console.error(error);
    }
  }

  public async deleteServicio(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ msg: 'No existe ese id' });

      const servicioUpdated = await ServicioModel.findByIdAndDelete(id);

      return res.status(200).json({
        msg: 'Servicio eliminado de manera correcta',
        servicioUpdated,
      });
    } catch (error) {
      return res.status(400).json({ msg: 'Hubo un error', error });
      console.error(error);
    }
  }

  public async activarServicio(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ServicioModel.updateOne({ _id: id }, { activado: true });
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(400).json({ msg: 'Hubo un error', error });
      console.error(error);
    }
  }

  public async desactivarServicio(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ServicioModel.updateOne({ _id: id }, { activado: false });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(404).json({ msg: 'No se pudo actualizar', err });
      console.error(err);
    }
  }
}

export const serviciosController = new ServiciosController();
