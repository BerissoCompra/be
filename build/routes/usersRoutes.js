"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("./../controllers/usersController");
const keys_1 = __importDefault(require("../keys"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UsersRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/signin', usersController_1.usersController.iniciarSesion);
        this.router.post('/signup', usersController_1.usersController.crearUsuario);
        this.router.post('/cliente/signin', usersController_1.usersController.iniciarSesionCliente);
        this.router.post('/cliente/signup', usersController_1.usersController.crearUsuarioCliente);
        this.router.get('/cliente', this.verifyToken, usersController_1.usersController.getClienteById);
        this.router.put('/cliente/:id/fav', this.verifyToken, usersController_1.usersController.addFavorito);
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
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;