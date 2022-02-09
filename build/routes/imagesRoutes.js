"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const keys_1 = __importDefault(require("../keys"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const imagesController_1 = require("../controllers/imagesController");
const multer_1 = __importDefault(require("../libs/multer"));
class ImagesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/upload', this.verifyToken, multer_1.default.single('file'), imagesController_1.imagesController.subirImagen);
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
const imagesRoutes = new ImagesRoutes();
exports.default = imagesRoutes.router;
