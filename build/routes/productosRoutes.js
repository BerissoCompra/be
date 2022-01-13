"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoController_1 = require("../controllers/productoController");
const keys_1 = __importDefault(require("../keys"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ProductosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //this.router.get('/:id', this.verifyToken, productoController.obtenerProductos);
        this.router.get('/productos/:id', productoController_1.productoController.obtenerProductosPorComercio);
        this.router.delete('/productos/:id', this.verifyToken, productoController_1.productoController.elimiarProducto);
        this.router.put('/productos/:id', this.verifyToken, productoController_1.productoController.actualizarProducto);
        this.router.post('/nuevo/:id', this.verifyToken, productoController_1.productoController.nuevoProducto);
    }
    verifyToken(req, res, next) {
        if (!req.headers.authorization)
            return res.status(401).json('No Autorizado');
        const token = req.headers.authorization.substring(7);
        if (token !== '') {
            const content = jsonwebtoken_1.default.verify(token, keys_1.default.seckey);
            req.data = content;
            next();
        }
        else {
            return res.status(401).json('No Token');
        }
    }
}
const productosRoutes = new ProductosRoutes();
exports.default = productosRoutes.router;
