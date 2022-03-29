"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidosController = void 0;
const Pedido_1 = __importDefault(require("../models/Pedido"));
const Comercio_1 = __importDefault(require("../models/Comercio"));
const tipo_estado_enum_1 = require("../models/enum/tipo-estado.enum");
const Cliente_1 = __importDefault(require("../models/Cliente"));
const html_pdf_1 = __importDefault(require("html-pdf"));
const generatePdf_1 = require("../libs/generatePdf");
class PedidosController {
    crearPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comercioId, productos, clienteId, configuracion } = req.body;
            const usuario = yield Cliente_1.default.findById(clienteId);
            const comercio = yield Cliente_1.default.findById(comercioId);
            const codigoEntrega = Math.round(Math.random() * 10000);
            const codigoPedido = `CA-${Math.round(Math.random() * 10000)}`;
            let totalPedido = 0;
            productos.map((prod) => {
                totalPedido += prod.precioTotal;
            });
            const pedido = new Pedido_1.default({
                comercioId,
                comercio,
                idPedido: codigoPedido,
                clienteId,
                productos,
                configuracion: Object.assign(Object.assign({}, configuracion), { direccion: usuario === null || usuario === void 0 ? void 0 : usuario.direccion, numDep: usuario === null || usuario === void 0 ? void 0 : usuario.numDep, direccionInfo: usuario === null || usuario === void 0 ? void 0 : usuario.direccionInfo, telefono: usuario === null || usuario === void 0 ? void 0 : usuario.telefono }),
                estado: tipo_estado_enum_1.SeguimientoEnum.ESPERANDO_APROBACION,
                total: totalPedido,
                items: productos.length,
                codigoEntrega,
            });
            const pedidoCreado = yield pedido.save();
            if (pedidoCreado) {
                return res.status(200).json({ _id: pedidoCreado._id });
            }
            else {
                return res.status(500).json({ err: 'El pedido no se pudo crear correctamente.' });
            }
        });
    }
    obtenerPedidosId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedido = yield Pedido_1.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ ok: 'No se encontraron pedidos' });
            });
            if (pedido) {
                let pedidoResponse = {};
                const { comercioId } = pedido;
                const comercio = yield Comercio_1.default.findById(comercioId);
                pedidoResponse = { pedido, comercio };
                return res.status(200).json(pedidoResponse);
            }
            else {
                return res.status(404).json({ ok: 'No se encontraron pedidos' });
            }
        });
    }
    obtenerPedidosCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidos = yield Pedido_1.default.find({ clienteId: id }).sort(({ createdAt: -1 }));
            if (pedidos) {
                let pedidosResponse = [];
                yield Promise.all(pedidos.map((pedido) => __awaiter(this, void 0, void 0, function* () {
                    const comercioId = pedido.comercioId;
                    const comercio = yield Comercio_1.default.findById(comercioId);
                    if (comercio) {
                        const pedidoCompleto = Object.assign(Object.assign({}, pedido._doc), { comercio });
                        pedidosResponse.push(pedidoCompleto);
                    }
                })));
                return res.status(200).json(pedidosResponse);
            }
            else {
                return res.status(404).json({ ok: 'No se encontraron pedidos' });
            }
        });
    }
    obtenerPedidosComercios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, estado } = req.params;
            const pedidos = yield Pedido_1.default.find({ comercioId: id, estado: estado });
            if (pedidos) {
                return res.status(200).json(pedidos);
            }
            else {
                return res.status(404).json({ ok: 'No se encontraron pedidos' });
            }
        });
    }
    actualizarPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidoActualizado = yield Pedido_1.default.updateOne({ _id: id }, req.body);
            if (pedidoActualizado) {
                return res.status(200).json({ ok: 'Pedido actualizado.' });
            }
            else {
                return res.status(500).json({ err: 'El pedido no se pudo crear correctamente.' });
            }
        });
    }
    cambiarEstadoPedido(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Actualizando virgen puta");
            const { id } = req.params;
            const pedido = yield Pedido_1.default.findById(id);
            const comercio = yield Comercio_1.default.findById(pedido.comercioId);
            if (comercio && pedido.estado != tipo_estado_enum_1.SeguimientoEnum.CERRADO) {
                let nuevoEstado = pedido.estado;
                if (pedido.estado === tipo_estado_enum_1.SeguimientoEnum.ESPERANDO_APROBACION && ((_a = pedido.configuracion) === null || _a === void 0 ? void 0 : _a.pagoDigital)) {
                    nuevoEstado = tipo_estado_enum_1.SeguimientoEnum.LISTO_PARA_ABONAR;
                }
                else if (pedido.estado === tipo_estado_enum_1.SeguimientoEnum.ESPERANDO_APROBACION && !((_b = pedido.configuracion) === null || _b === void 0 ? void 0 : _b.pagoDigital)) {
                    nuevoEstado = tipo_estado_enum_1.SeguimientoEnum.EN_CURSO;
                }
                else if (pedido.estado === tipo_estado_enum_1.SeguimientoEnum.FINALIZADO && ((_c = pedido.configuracion) === null || _c === void 0 ? void 0 : _c.retira)) {
                    nuevoEstado = tipo_estado_enum_1.SeguimientoEnum.LISTO_PARA_RETIRAR;
                }
                else if (pedido.estado === tipo_estado_enum_1.SeguimientoEnum.ENVIADO) {
                    nuevoEstado = pedido.estado + 2;
                }
                else {
                    nuevoEstado = pedido.estado + 1;
                }
                const pedidoActualizado = yield Pedido_1.default.findByIdAndUpdate(id, { estado: nuevoEstado });
                if (nuevoEstado === tipo_estado_enum_1.SeguimientoEnum.FINALIZADO) {
                    const ventas = comercio.estadisticas.ventas + 1;
                    const ingresosTotales = comercio.estadisticas.ingresosTotales + pedido.total;
                    const deuda = comercio.estadisticas.deuda + pedido.total;
                    const actualizarComercio = yield Comercio_1.default.findByIdAndUpdate(pedido.comercioId, {
                        estadisticas: Object.assign(Object.assign({}, comercio.estadisticas), { ventas,
                            ingresosTotales,
                            deuda })
                    });
                }
                if (pedidoActualizado) {
                    return res.status(200).json({ _id: pedidoActualizado._id });
                }
                else {
                    return res.status(500).json({ err: 'El pedido no se pudo actualizar correctamente.' });
                }
            }
            else {
                return res.status(404).json({ err: 'El pedido no se pudo actualizar correctamente.' });
            }
        });
    }
    eliminarPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidoEliminado = yield Pedido_1.default.deleteOne({ _id: id })
                .then((re) => {
                return res.status(200).json({ msg: 'Pedido eliminado.' });
            })
                .catch((error) => {
                return res.status(500).json({ msg: 'El pedido no se pudo eliminar correctamente.' });
            });
        });
    }
    obtenerTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedido = yield Pedido_1.default.findById(id);
            const options = {
                "orientation": "portrait",
                "height": "600",
                "width": "512", // portrait or landscape
            };
            const content = generatePdf_1.crearHtmlPedido(pedido);
            html_pdf_1.default.create(content, options).toStream((err, stream) => {
                if (err) {
                    console.log("Err");
                    return res.end(err.stack);
                }
                res.setHeader('Content-type', 'application/pdf');
                return stream.pipe(res);
            });
        });
    }
}
exports.pedidosController = new PedidosController();
