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
exports.publicidadController = void 0;
const Comercio_1 = __importDefault(require("../models/Comercio"));
const Publicidad_1 = __importDefault(require("../models/Publicidad"));
class PublicidadController {
    obtenerComerciosPublicidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tipo } = req.params;
            var rand = Math.random();
            const comerciosPublicidad = yield Publicidad_1.default.find({ tipo }).sort({ rand: 1 });
            let response = [];
            if (comerciosPublicidad.length > 0) {
                yield Promise.all(comerciosPublicidad.map((publicidad) => __awaiter(this, void 0, void 0, function* () {
                    const comercio = yield Comercio_1.default.findById(publicidad.comercioId);
                    response = [comercio, ...response];
                })));
                return res.status(200).json(response);
            }
            return res.status(200).json([]);
        });
    }
    agregarComerciosPublicidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comercioId, tipo } = req.body;
            const publicidad = yield new Publicidad_1.default({ comercioId, tipo });
            yield publicidad.save()
                .then(() => {
                return res.status(200).json({ msg: 'ok' });
            })
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al agregar comercio a Publicidad' });
            });
        });
    }
    eliminarComerciosPublicidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comercioId, tipo } = req.body;
            const eliminar = yield Publicidad_1.default.deleteMany({ comercioId, tipo })
                .then(() => {
                return res.status(200).json({ msg: 'ok' });
            })
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al agregar comercio a Publicidad' });
            });
        });
    }
}
exports.publicidadController = new PublicidadController();
