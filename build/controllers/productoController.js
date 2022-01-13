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
class ProductoController {
    nuevoProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const producto = new Producto_1.default(req.body);
            const productoGuaradado = yield producto.save();
            if (productoGuaradado) {
                return res.status(200).json({ ok: 'Comercio creado.' });
            }
            else {
                return res.status(500).json({ err: 'El comercio no se pudo crear correctamente.' });
            }
        });
    }
    obtenerProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const db = await connect();
            // const {id} = req.params;
            // const [[cat], []]: any = await db.query('SELECT id FROM catalogos WHERE comercioId = ? ', [id]);
            // if(cat){   
            //     const [producto]: any = await db.query('SELECT * FROM productos WHERE catalogoId = ?', [cat.id]);
            //     if(producto){
            //         return res.status(200).json(producto)
            //     }
            //     else{
            //         return res.status(200).json({ok:"No posee productos"})
            //     }      
            // }
            // else{
            //     const [catalogo]: any = await db.query('INSERT INTO catalogos SET comercioId = ?', [id]);
            //     if(catalogo){
            //         const catalogoId = catalogo.insertId;
            //         const [response]: any = await db.query('UPDATE comercios SET catalogoId = ? WHERE id = ?', [catalogoId,id]); 
            //         if(response?.affectedRows > 0){
            //             return res.status(200).send('catalogo creado');
            //         }   
            //     }
            // }
        });
    }
    elimiarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield Producto_1.default.deleteOne({ _id: id });
            if (producto) {
                return res.status(200).json({ ok: 'Producto eliminado.' });
            }
            else {
                return res.status(500).json({ err: 'El producto no se pudo eliminar.' });
            }
        });
    }
    actualizarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield Producto_1.default.updateOne({ _id: id }, req.body);
            if (producto) {
                return res.status(200).json({ ok: 'Producto actualizado.' });
            }
            else {
                return res.status(500).json({ err: 'El producto no se puede actualizar.' });
            }
        });
    }
    obtenerProductosPorComercio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productos = yield Producto_1.default.find({ comercioId: id });
            if (productos.length > 0) {
                return res.status(200).json(productos);
            }
            else {
                return res.status(404).json({ err: 'No se encontraron productos' });
            }
        });
    }
}
exports.productoController = new ProductoController();
