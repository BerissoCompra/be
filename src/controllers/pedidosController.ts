import { Request, Response } from 'express';
import keys from '../keys';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import Pedido from '../models/Pedido';
import Comercio from '../models/Comercio';
import { SeguimientoEnum } from '../models/enum/tipo-estado.enum';
import Cliente from '../models/Cliente';
//import pdf, { CreateOptions } from 'html-pdf';
import { crearHtmlPedido } from '../libs/generatePdf';
import { ensureSymlinkSync } from 'fs-extra';
import fs from 'fs-extra';
import path from 'path';
const pdf = require("pdf-creator-node");

class PedidosController {
  public async crearPedido(req: Request, res: Response) {
    const { comercioId, productos, clienteId, configuracion } = req.body;
    try {
      const usuario = await Cliente.findById(clienteId);
      const comercio = await Comercio.findById(comercioId);

      const codigoEntrega = Math.round(Math.random() * 10000);
      const codigoPedido = `CA-${Math.round(Math.random() * 10000)}`;

      let totalPedido: number = 0;

      productos.map((prod: any) => {
        totalPedido += prod.precioTotal;
      });

      if (
        comercio?.tipoEnvio === 'pago' &&
        comercio?.costoEnvio > 0 &&
        configuracion?.envio &&
        !configuracion?.retira
      ) {
        totalPedido += comercio.costoEnvio;
      }

      const pedido = new Pedido({
        comercioId,
        comercio,
        idPedido: codigoPedido,
        clienteId,
        productos,
        configuracion: {
          ...configuracion,
          telefono: usuario?.telefono,
        },
        estado: SeguimientoEnum.ESPERANDO_APROBACION,
        total: totalPedido,
        items: productos.length,
        codigoEntrega,
      });

      const pedidoCreado = await pedido.save();

      if (pedidoCreado) {
        return res.status(200).json({ _id: pedidoCreado._id });
      } else {
        return res
          .status(500)
          .json({ err: 'El pedido no se pudo crear correctamente.' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async obtenerPedidosId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const pedido = await Pedido.findById(id);
      let pedidoResponse: any = {};
      const { comercioId } = pedido;
      const comercio = await Comercio.findById(comercioId);
      pedidoResponse = { pedido, comercio };
      return res.status(200).json(pedidoResponse);
    } catch (error) {
      return res.status(404).json({ ok: 'No se encontraron pedidos' });
    }
  }

  public async obtenerPedidosCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedidos: any[] = await Pedido.find({ clienteId: id }).sort({
        createdAt: -1,
      });

      if (pedidos) {
        let pedidosResponse: any[] = [];

        await Promise.all(
          pedidos.map(async (pedido) => {
            const comercioId = pedido.comercioId;
            const comercio = await Comercio.findById(comercioId);
            if (comercio) {
              const pedidoCompleto = { ...pedido._doc, comercio };
              pedidosResponse.push(pedidoCompleto);
            }
          }),
        );

        return res.status(200).json(pedidosResponse);
      }
    } catch (error) {
      res.status(404).json({ ok: 'No se encontraron pedidos' });
      console.error(error);
    }
  }

  public async obtenerPedidosComercios(req: Request, res: Response) {
    try {
      const { id, estado } = req.params;
      const pedidos = await Pedido.find({ comercioId: id, estado: estado });
      let pedidosResponse: any[] = [];
      await Promise.all(
        pedidos.map(async(pedido)=>{
          const usuarioCliente = await Cliente.findById(pedido.clienteId);
          const {password, ...rest} = usuarioCliente._doc;
          pedidosResponse.push({
            ...pedido._doc,
            cliente: rest
          })
        })
      )

      if (pedidosResponse) {
        return res.status(200).json(pedidosResponse);
      } else {
        return res.status(404).json({ ok: 'No se encontraron pedidos' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async actualizarPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedidoActualizado = await Pedido.updateOne({ _id: id }, req.body);
      if (pedidoActualizado) {
        return res.status(200).json({ ok: 'Pedido actualizado.' });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ err: 'El pedido no se pudo crear correctamente.' });
    }
  }

  public async cambiarEstadoPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findById(id);
      const comercio = await Comercio.findById(pedido.comercioId);

      if (comercio && pedido.estado != SeguimientoEnum.CERRADO) {
        let nuevoEstado = pedido.estado;
        if (
          pedido.estado === SeguimientoEnum.ESPERANDO_APROBACION &&
          pedido.configuracion?.pagoDigital
        ) {
          nuevoEstado = SeguimientoEnum.LISTO_PARA_ABONAR;
        } else if (
          pedido.estado === SeguimientoEnum.ESPERANDO_APROBACION &&
          !pedido.configuracion?.pagoDigital
        ) {
          nuevoEstado = SeguimientoEnum.EN_CURSO;
        } else if (
          pedido.estado === SeguimientoEnum.FINALIZADO &&
          pedido.configuracion?.retira
        ) {
          nuevoEstado = SeguimientoEnum.LISTO_PARA_RETIRAR;
        } else if (pedido.estado === SeguimientoEnum.ENVIADO) {
          nuevoEstado = pedido.estado + 2;
        } else {
          nuevoEstado = pedido.estado + 1;
        }

        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, {
          estado: nuevoEstado,
        });

        if (nuevoEstado === SeguimientoEnum.FINALIZADO) {
          const ventas = comercio.estadisticas.ventas + 1;
          const ingresosTotales =
            comercio.estadisticas.ingresosTotales + pedido.total;
          const deuda = comercio.estadisticas.deuda + pedido.total;
          const actualizarComercio = await Comercio.findByIdAndUpdate(
            pedido.comercioId,
            {
              estadisticas: {
                ...comercio.estadisticas,
                ventas,
                ingresosTotales,
                deuda,
              },
            },
          );
        }

        if (pedidoActualizado) {
          return res.status(200).json({ _id: pedidoActualizado._id });
        }
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ err: 'El pedido no se pudo actualizar correctamente.' });
    }
  }

  public async rechazarPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {motivo} = req.body;
      const pedido = await Pedido.findByIdAndUpdate(id, {estado: SeguimientoEnum.RECHAZADO, motivoRechazo: motivo});
      if (pedido) {
        return res.status(200).json({ _id: pedido._id });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ err: 'El pedido no se pudo actualizar correctamente.' });
    }
  }

  public async eliminarPedido(req: Request, res: Response) {
    const { id } = req.params;
    const pedidoEliminado = await Pedido.deleteOne({ _id: id })
      .then((re) => {
        return res.status(200).json({ msg: 'Pedido eliminado.' });
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .json({ msg: 'El pedido no se pudo eliminar correctamente.' });
      });
  }

  public async obtenerTicket(req: Request, res: Response) {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);

    try {
      var html = fs.readFileSync(path.resolve('pedido.html'), "utf8");

      var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
      };
      var users = [
        {
          name: "Shyam",
          age: "26",
        },
        {
          name: "Navjot",
          age: "26",
        },
        { 
          name: "Vitthal",
          age: "26",
        },
      ];
      var document = {
        html: html,
        data: {
        },
        path: "./output.pdf",
        type: "",
      };
  
      pdf.create(document, options)
      .then((doc: any) => {
        res.setHeader('Content-type', 'application/pdf');
        return res.sendFile(doc.filename);
      })
      .catch((error: any) => {
        console.log('Err');
        return res.end(error);
      });
    } catch (error) {
      console.log('Err: ', error);
      return res.end(error);
    }

    // const options: CreateOptions = {
    //   // allowed units: A3, A4, A5, Legal, Letter, Tabloid
    //   orientation: 'portrait',
    //   height: '600',
    //   width: '512', // portrait or landscape
    // };

    // const content = crearHtmlPedido(pedido);

    // pdf.create(content, options).toStream((err: any, stream) => {
    //   if (err) {
    //     console.log('Err');
    //     return res.end(err.stack);
    //   }
    //   res.setHeader('Content-type', 'application/pdf');
    //   return stream.pipe(res);
    // });
  }
}

export const pedidosController = new PedidosController();
