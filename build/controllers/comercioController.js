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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comercioController = void 0;
const Comercio_1 = __importDefault(require("../models/Comercio"));
const tipo_filtro_enum_1 = require("../models/enum/tipo-filtro.enum");
const Usuario_1 = __importDefault(require("../models/Usuario"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const Comercio_2 = __importDefault(require("../models/Comercio"));
const Producto_1 = __importDefault(require("../models/Producto"));
const Comentarios_1 = __importDefault(require("../models/Comentarios"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const Pedido_1 = __importDefault(require("../models/Pedido"));
const html_pdf_1 = __importDefault(require("html-pdf"));
const generatePdf_1 = require("../libs/generatePdf");
class ComercioController {
    crearComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comercio = new Comercio_1.default(Object.assign(Object.assign({}, req.body), { imagen: 'https://www.uifrommars.com/wp-content/uploads/2018/08/crear-paleta-colores-diseno-ui.jpg' }));
            const comercioGuardado = yield comercio.save()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'El comercio no se pudo crear correctamente.' });
            });
            if (comercioGuardado) {
                return res.status(200).json({ msg: 'Comercio creado.' });
            }
            else {
                return res.status(500).json({ msg: 'El comercio no se pudo crear correctamente.' });
            }
        });
    }
    obtenerComercios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comercios = yield Comercio_1.default.find({})
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al obtener todos los comercios.' });
            });
            return res.status(200).json(comercios);
        });
    }
    obtenerComerciosById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(404);
            }
            const comercio = yield Comercio_1.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al obtener comercio.' });
            });
            const productos = yield Producto_1.default.find({ comercioId: comercio._id });
            return res.status(200).json({ productos, comercio });
        });
    }
    obtenerResponsableById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comercio = yield Comercio_2.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al obtener responsable.' });
            });
            if (comercio === null || comercio === void 0 ? void 0 : comercio.usuarioId) {
                const usuario = yield Usuario_1.default.findById(comercio.usuarioId)
                    .then()
                    .catch((err) => {
                    console.log(err);
                    return res.status(404).json({ msg: 'Error al obtener responsable.' });
                });
                const { password } = usuario, rest = __rest(usuario, ["password"]);
                return res.status(200).json(rest);
            }
            else {
                return res.status(404).json({ msg: 'Error al obtener responsable.' });
            }
        });
    }
    obtenerComerciosByFiltro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filtro } = req.params;
            if (filtro === tipo_filtro_enum_1.TipoFiltroEnum.ABIERTOS) {
                const comercios = yield Comercio_1.default.find({ abierto: true, activado: true }).sort(({ estrellas: -1 }))
                    .then()
                    .catch((err) => {
                    console.log(err);
                    return res.status(404).json({ msg: 'Error al obtener comercios.' });
                });
                console.log(comercios);
                return res.status(200).json(comercios);
            }
            else if (filtro === tipo_filtro_enum_1.TipoFiltroEnum.DESTACADOS) {
                const comercios = yield Comercio_1.default.find({ estrellas: { $gt: 3 }, activado: true }).sort(({ estrellas: -1 }))
                    .then()
                    .catch((err) => {
                    console.log(err);
                    return res.status(404).json({ msg: 'Error al obtener comercios.' });
                });
                return res.status(200).json(comercios);
            }
            else if (filtro === 'todos') {
                const comercios = yield Comercio_1.default.find({ activado: true }).sort(({ estrellas: -1 }))
                    .then()
                    .catch((err) => {
                    console.log(err);
                    return res.status(404).json({ msg: 'Error al obtener comercios.' });
                });
                return res.status(200).json(comercios);
            }
        });
    }
    obtenerComerciosByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.data;
            const comercios = yield Comercio_1.default.find({ usuarioId: uid });
            if (comercios.length > 0) {
                return res.status(200).json(comercios[0]);
            }
            else {
                return res.status(404).json({ msg: 'No se encontro el comercio' });
            }
        });
    }
    actualizarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comercio = yield Comercio_1.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al actualizar producto.' });
            });
            if (comercio.imagenPath && comercio.imagenPath != req.body.imagenPath) {
                yield fs_extra_1.default.unlink(path_1.default.resolve(comercio.imagenPath))
                    .then(() => { console.log("Imagen anterior eliminada"); })
                    .catch((err) => console.log(err));
            }
            yield Comercio_1.default.findByIdAndUpdate(id, req.body).then((ok) => {
                return res.status(200).json(ok);
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se pudo actualizar' });
            });
        });
    }
    activarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield Comercio_1.default.updateOne({ _id: id }, { activado: true }).then((ok) => {
                return res.status(200).json(ok);
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se pudo actualizar' });
            });
        });
    }
    abrirComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield Comercio_1.default.updateOne({ _id: id }, { abierto: true }).then((ok) => {
                return res.status(200).json(ok);
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se pudo actualizar' });
            });
        });
    }
    cerrarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield Comercio_1.default.updateOne({ _id: id }, { abierto: false }).then((ok) => {
                return res.status(200).json(ok);
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se pudo actualizar' });
            });
        });
    }
    desactivarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield Comercio_1.default.updateOne({ _id: id }, { activado: false }).then((ok) => {
                return res.status(200).json(ok);
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se pudo actualizar' });
            });
        });
    }
    obtenerComentariosByComercioId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comentarios = yield Comentarios_1.default.find({ comercioId: id }).limit(10).sort(({ createdAt: -1 }));
            let resultadoComentarios = [];
            if (comentarios.length > 0) {
                yield Promise.all(comentarios.map((comentario) => __awaiter(this, void 0, void 0, function* () {
                    const usuario = yield Cliente_1.default.findById(comentario.usuarioId);
                    if (usuario) {
                        resultadoComentarios.push({
                            comentario: comentario.comentario,
                            puntuacion: comentario.puntuacion,
                            usuario: usuario.nombre
                        });
                    }
                })));
            }
            return res.status(200).json(resultadoComentarios);
        });
    }
    calificarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { calificacion, comentario, usuarioId } = req.body;
            let punt;
            let cont;
            let estrellas;
            if (!id)
                return res.status(404).json({ msg: 'ID Inválido' });
            const comercio = yield Comercio_1.default.findById(id);
            if (!comercio)
                return res.status(404).json({ msg: 'No se encontro el comercio' });
            punt = comercio.puntuacion + calificacion;
            cont = comercio.contadorCalificaciones ? comercio.contadorCalificaciones + 1 : 1;
            estrellas = punt / cont;
            const comercioActualizado = yield Comercio_1.default.findByIdAndUpdate(id, {
                puntuacion: punt,
                contadorCalificaciones: cont,
                estrellas,
            });
            if (comercioActualizado) {
                if (comentario) {
                    const comment = new Comentarios_1.default({
                        comercioId: id,
                        usuarioId,
                        comentario,
                        puntuacion: calificacion
                    });
                    const saveComentario = yield comment.save();
                }
                return res.status(200).json(comercioActualizado);
            }
            else {
                return res.status(404).json({ msg: 'No se pudo calificar el comercio' });
            }
        });
    }
    registrarVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { total } = req.body;
            const comercio = yield Comercio_1.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al registrar venta.' });
            });
            if (comercio) {
                const ventas = comercio.estadisticas.ventas ? comercio.estadisticas.ventas : 0;
                const ingresoTotal = comercio.estadisticas.ingresosTotales ? comercio.estadisticas.ingresosTotales : 0;
                const deuda = comercio.estadisticas.deuda ? comercio.estadisticas.deuda : 0;
                const calculoDeuda = deuda + total;
                yield Comercio_1.default.findByIdAndUpdate(id, { estadisticas: Object.assign(Object.assign({}, comercio.estadisticas), { ventas: ventas + 1, ingresosTotales: ingresoTotal + total, deuda: calculoDeuda }) })
                    .then()
                    .catch((err) => {
                    console.log(err);
                    return res.status(404).json({ msg: 'Error al registrar venta.' });
                });
                return res.status(200).json({ msg: 'Ha completado un pedido' });
            }
            else {
                return res.status(404).json({ msg: 'No se encontro el comercio' });
            }
        });
    }
    registrarPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { total } = req.body;
            const comercio = yield Comercio_1.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al regsitrar pago.' });
            });
            if (comercio) {
                const deuda = comercio.estadisticas.deuda ? comercio.estadisticas.deuda : 0;
                const date = new Date();
                const mes = date.getMonth() + 1;
                const year = date.getFullYear();
                const dateFinal = new Date(year, mes, 10);
                yield Comercio_1.default.updateOne({ _id: id }, { estadisticas: Object.assign(Object.assign({}, comercio.estadisticas), { deuda: 0, ultimoPago: new Date(), proximoPago: dateFinal }) })
                    .then()
                    .catch((err) => {
                    console.log(err);
                    return res.status(404).json({ msg: 'Error al regsitrar pago.' });
                });
                return res.status(200).json({ msg: 'Pago Registrado' });
            }
            else {
                return res.status(404).json({ msg: 'No se encontro el comercio' });
            }
        });
    }
    verificarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comercio = yield Comercio_1.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al verificar comercio.' });
            });
            if (comercio) {
                if (comercio.abierto) {
                    return res.status(200).json({ estado: true });
                }
                else {
                    return res.status(200).json({ estado: false });
                }
            }
            else {
                return res.status(404).json({ msg: 'No se encontro el comercio' });
            }
        });
    }
    eliminarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comercio = yield Comercio_1.default.findById(id)
                .then()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al eliminar comercio.' });
            });
            if (comercio) {
                if (comercio.imagenPath) {
                    yield fs_extra_1.default.unlink(path_1.default.resolve(comercio.imagenPath))
                        .then()
                        .catch((err) => {
                        console.log(err);
                    });
                }
                yield Comercio_1.default.findByIdAndDelete(id)
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    yield Usuario_1.default.findByIdAndDelete(comercio.usuarioId)
                        .then(() => {
                        return res.status(200).json({ msg: 'Eliminado' });
                    })
                        .catch((err) => {
                        console.log(err);
                        return res.status(404).json({ msg: 'No se encontro el comercio' });
                    });
                }))
                    .catch((err) => {
                    console.log(err);
                    return res.status(404).json({ msg: 'No se encontro el comercio' });
                });
            }
            else {
                return res.status(404).json({ msg: 'No se encontro el comercio' });
            }
        });
    }
    cerrarCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ msg: 'No se ha podido realizar el cierre' });
            const pedidos = yield Pedido_1.default.find({ comercioId: id });
            yield Promise.all(pedidos.map((pedido) => __awaiter(this, void 0, void 0, function* () {
                if (pedido._id) {
                    yield Pedido_1.default.findByIdAndDelete(pedido._id);
                }
            })));
            return res.status(200).json({ msg: 'Cierre de caja realizado correctamente' });
        });
    }
    obtenerCierreDeCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidos = yield Pedido_1.default.find({ comercioId: id });
            if (pedidos) {
                const cantidadPedidos = pedidos.length;
                let totalIngresoDiario = 0;
                let pedidosDelDia = [];
                yield Promise.all(pedidos.map((pedido) => __awaiter(this, void 0, void 0, function* () {
                    if (pedido._id) {
                        //await Pedido.findByIdAndDelete(pedido._id);
                        const usuario = yield Cliente_1.default.findById(pedido.clienteId);
                        totalIngresoDiario = totalIngresoDiario + pedido.total;
                        pedidosDelDia.push({
                            pedidoId: pedido.idPedido,
                            pagoEfectivo: pedido.configuracion.pagoEfectivo,
                            pagoDigital: pedido.configuracion.pagoDigital,
                            items: pedido.items,
                            total: pedido.total,
                            fecha: pedido.createdAt,
                            nombreCliente: usuario.nombre,
                        });
                    }
                })));
                return res.status(200).json({
                    cantidadPedidos,
                    totalIngresoDiario,
                    pedidosDelDia
                });
            }
            else {
                return res.status(404).json({
                    msg: 'Error al cerrar la caja',
                });
            }
        });
    }
    cerrarCajaTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const pedidos = yield Pedido_1.default.find({ comercioId: id });
            if (pedidos) {
                const cantidadPedidos = pedidos.length;
                let totalIngresoDiario = 0;
                let pedidosDelDia = [];
                yield Promise.all(pedidos.map((pedido) => __awaiter(this, void 0, void 0, function* () {
                    if (pedido._id) {
                        //await Pedido.findByIdAndDelete(pedido._id);
                        const usuario = yield Cliente_1.default.findById(pedido.clienteId);
                        totalIngresoDiario = totalIngresoDiario + pedido.total;
                        pedidosDelDia.push({
                            pedidoId: pedido.idPedido,
                            pagoEfectivo: pedido.configuracion.pagoEfectivo,
                            pagoDigital: pedido.configuracion.pagoDigital,
                            items: pedido.items,
                            total: pedido.total,
                            fecha: pedido.createdAt,
                            nombreCliente: usuario.nombre,
                        });
                    }
                })));
                const options = {
                    "format": "A4",
                    "orientation": "portrait", // portrait or landscape
                };
                const content = generatePdf_1.crearHtmlCierreCaja(totalIngresoDiario, cantidadPedidos, pedidosDelDia);
                html_pdf_1.default.create(content, options).toStream((err, stream) => {
                    if (err) {
                        console.log("Err");
                        return res.end(err.stack);
                    }
                    res.setHeader('Content-type', 'application/pdf');
                    return stream.pipe(res);
                });
            }
            else {
                return res.status(404).json({
                    msg: 'Error al cerrar la caja',
                });
            }
        });
    }
}
exports.comercioController = new ComercioController();
