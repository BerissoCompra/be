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
exports.comercioController = void 0;
const Comercio_1 = __importDefault(require("../models/Comercio"));
const tipo_filtro_enum_1 = require("../models/enum/tipo-filtro.enum");
class ComercioController {
    crearComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comercio = new Comercio_1.default(req.body);
            const comercioGuardado = yield comercio.save();
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
            const comercios = yield Comercio_1.default.find({ activado: false });
            return res.status(200).json(comercios);
        });
    }
    obtenerComerciosById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comercios = yield Comercio_1.default.findById(id)
                .then((comercio) => {
                return res.status(200).json(comercio);
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se encontro el comercio' });
            });
        });
    }
    obtenerComerciosByFiltro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { filtro } = req.params;
            console.log(filtro);
            if (filtro === tipo_filtro_enum_1.TipoFiltroEnum.ABIERTOS) {
                const comercios = yield Comercio_1.default.find({ abierto: true, activado: true }).sort(({ estrellas: -1 }))
                    .then((comercio) => {
                    return res.status(200).json(comercio);
                })
                    .catch((error) => {
                    return res.status(404).json({ msg: 'No se encontraron el comercio' });
                });
            }
            else if (filtro === tipo_filtro_enum_1.TipoFiltroEnum.DESTACADOS) {
                const comercios = yield Comercio_1.default.find({ estrellas: { $gt: 3 }, activado: true }).sort(({ estrellas: -1 }))
                    .then((comercio) => {
                    return res.status(200).json(comercio);
                })
                    .catch((error) => {
                    return res.status(404).json({ msg: 'No se encontraron el comercio' });
                });
            }
            else if (filtro === 'todos') {
                const comercios = yield Comercio_1.default.find({ activado: true }).sort(({ estrellas: -1 }))
                    .then((comercio) => {
                    return res.status(200).json(comercio);
                })
                    .catch((error) => {
                    return res.status(404).json({ msg: 'No se encontraron el comercio' });
                });
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
            yield Comercio_1.default.updateOne({ _id: id }, req.body).then((ok) => {
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
    calificarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { calificacion } = req.body;
            let punt;
            let cont;
            let estrellas;
            console.log(calificacion + " " + id);
            yield Comercio_1.default.findOne({ _id: id }).then((comercio) => __awaiter(this, void 0, void 0, function* () {
                console.log(comercio);
                punt = comercio.puntuacion + calificacion;
                cont = comercio.contadorCalificaciones ? comercio.contadorCalificaciones + 1 : 1;
                estrellas = punt / cont;
                yield Comercio_1.default.updateOne({ _id: id }, {
                    puntuacion: punt,
                    contadorCalificaciones: cont,
                    estrellas,
                })
                    .then((com) => {
                    return res.status(200).json(com);
                })
                    .catch((err) => {
                    return res.status(404).json({ msg: 'No se pudo actualizar' });
                });
            }));
        });
    }
    verificarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const comercios = yield Comercio_1.default.find({ _id: id });
            if (comercios.length > 0) {
                if (comercios[0].abierto) {
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
}
exports.comercioController = new ComercioController();
