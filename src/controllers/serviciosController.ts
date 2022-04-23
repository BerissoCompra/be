import { Request, Response } from 'express';
import ServicioModel from '../models/Servicio';

class ServiciosController {
  public async crearServicio(req: Request, res: Response) {
    try {
      const body = req.body;

      const servicio = new ServicioModel(body);
      //   console.log(servicio);
      await servicio.save();
      return res.status(200).json({ msg: 'Servicio creado correctamente', id: servicio._id });
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
}

export const serviciosController = new ServiciosController();
