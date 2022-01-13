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
                return res.status(200).json({ ok: 'Comercio creado.' });
            }
            else {
                return res.status(500).json({ err: 'El comercio no se pudo crear correctamente.' });
            }
        });
    }
    obtenerComercios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comercios = yield Comercio_1.default.find({});
            return res.status(200).json(comercios);
        });
    }
    obtenerComerciosById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comercios = yield Comercio_1.default.findById(id);
            if (comercios) {
                return res.status(200).json(comercios);
            }
            else {
                return res.status(404).json({ ok: 'No se encontro el comercio' });
            }
        });
    }
    obtenerComerciosByFiltro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            if (body.filtro === tipo_filtro_enum_1.TipoFiltroEnum.ABIERTOS) {
                const comercios = yield Comercio_1.default.find({ abierto: true });
                if (comercios) {
                    return res.status(200).json(comercios);
                }
                else {
                    return res.status(404).json({ ok: 'No se encontraron el comercio' });
                }
            }
            else {
                const comercios = yield Comercio_1.default.find({});
                if (comercios) {
                    return res.status(200).json(comercios);
                }
                else {
                    return res.status(404).json({ ok: 'No se encontraron el comercio' });
                }
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
                return res.status(404).json({ err: 'No se encontro el comercio' });
            }
        });
    }
    actualizarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const comercios = yield Comercio_1.default.updateOne({ _id: id }, req.body);
            if (comercios) {
                return res.status(200).json(comercios);
            }
            else {
                return res.status(404).json({ err: 'No se pudo actualizar' });
            }
        });
    }
    calificarComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { calificacion, contadorCalificaciones } = req.body;
            const comercios = yield Comercio_1.default.updateOne({ _id: id }, {
                puntuacion: calificacion,
                contadorCalificaciones: contadorCalificaciones
            });
            if (comercios) {
                return res.status(200).json(comercios);
            }
            else {
                return res.status(404).json({ err: 'No se pudo actualizar' });
            }
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
                return res.status(404).json({ err: 'No se encontro el comercio' });
            }
        });
    }
}
exports.comercioController = new ComercioController();
