"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedidosController_1 = require("./../controllers/pedidosController");
const keys_1 = __importDefault(require("../keys"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class PedidosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        // pedidos/....
        this.router.get('/:id', this.verifyToken, pedidosController_1.pedidosController.obtenerPedidosId);
        this.router.get('/cliente/:id', this.verifyToken, pedidosController_1.pedidosController.obtenerPedidosCliente);
        this.router.get('/comercio/:id/:estado', this.verifyToken, pedidosController_1.pedidosController.obtenerPedidosComercios);
        this.router.post('/crear', this.verifyToken, pedidosController_1.pedidosController.crearPedido);
        this.router.put('/:id', this.verifyToken, pedidosController_1.pedidosController.cambiarEstadoPedido);
        this.router.get('/:id/ticket', this.verifyToken, pedidosController_1.pedidosController.obtenerTicket);
        this.router.delete('/:id', this.verifyToken, pedidosController_1.pedidosController.eliminarPedido);
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
const pedidosRoutes = new PedidosRoutes();
exports.default = pedidosRoutes.router;
