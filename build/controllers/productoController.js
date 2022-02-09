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
exports.productoController = void 0;
const Producto_1 = __importDefault(require("../models/Producto"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class ProductoController {
    nuevoProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { producto } = req.body;
            const prod = new Producto_1.default(producto);
            const productoGuaradado = yield prod.save()
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al crear producto.' });
            });
            if (productoGuaradado) {
                return res.status(200).json({ msg: 'Producto creado.' });
            }
            else {
                return res.status(404).json({ msg: 'Error al crear producto.' });
            }
        });
    }
    elimiarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield Producto_1.default.findByIdAndRemove(id)
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al eliminar producto.' });
            });
            if (producto) {
                yield fs_extra_1.default.unlink(path_1.default.resolve(producto.imagenPath))
                    .then(() => {
                    return res.status(200).json({ msg: 'Producto eliminado.' });
                })
                    .catch((err) => {
                    console.log(err);
                    return res.status(200).json({ msg: 'Producto eliminado.' });
                });
            }
            else {
                return res.status(404).json({ msg: 'El producto no se pudo eliminar.' });
            }
        });
    }
    actualizarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const obtenerProducto = yield Producto_1.default.findById(id);
            //Elimino la imagen anterior
            if (obtenerProducto.imagenPath) {
                yield fs_extra_1.default.unlink(path_1.default.resolve(obtenerProducto.imagenPath))
                    .then(() => { console.log("Img eliminada"); })
                    .catch((err) => { console.log(err); });
            }
            const producto = yield Producto_1.default.findByIdAndUpdate(id, req.body)
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al actualizar.' });
            });
            if (producto) {
                return res.status(200).json({ msg: 'Producto actualizado.' });
            }
            else {
                return res.status(404).json({ msg: 'El producto no se puede actualizar.' });
            }
        });
    }
    obtenerProductosPorComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productos = yield Producto_1.default.find({ comercioId: id })
                .catch((err) => {
                console.log(err);
                return res.status(404).json({ msg: 'Error al obtener productos.' });
            });
            if (productos) {
                return res.status(200).json(productos);
            }
            else {
                return res.status(404).json({ msg: 'No se encontraron productos' });
            }
        });
    }
}
exports.productoController = new ProductoController();
