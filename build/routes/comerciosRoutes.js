"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comercioController_1 = require("../controllers/comercioController");
const keys_1 = __importDefault(require("../keys"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ComerciosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //TODO Ver proximamente el middleware
        this.router.get('/', comercioController_1.comercioController.obtenerComercios);
        this.router.post('/new', comercioController_1.comercioController.crearComercio);
        this.router.get('/obtener', this.verifyToken, comercioController_1.comercioController.obtenerComerciosByUserId);
        this.router.post('/filtrar/:filtro', this.verifyToken, comercioController_1.comercioController.obtenerComerciosByFiltro);
        this.router.get('/:id', this.verifyToken, comercioController_1.comercioController.obtenerComerciosById);
        this.router.put('/:id', this.verifyToken, comercioController_1.comercioController.actualizarComercio);
        this.router.put('/calificar/:id', comercioController_1.comercioController.calificarComercio);
        this.router.get('/verificar/:id', this.verifyToken, comercioController_1.comercioController.verificarComercio);
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
const comerciosRoutes = new ComerciosRoutes();
exports.default = comerciosRoutes.router;
