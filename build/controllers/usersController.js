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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const keys_1 = __importDefault(require("../keys"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const Comercio_1 = __importDefault(require("../models/Comercio"));
class UsersController {
    iniciarSesion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const usuarioExiste = yield Usuario_1.default.find({ email: email, password: password });
            if (usuarioExiste.length > 0) {
                const data = JSON.stringify({ uid: usuarioExiste[0]._id });
                const token = jsonwebtoken_1.default.sign(data, keys_1.default.seckey);
                return res.status(200).json({ token: token });
            }
            else {
                return res.status(500).json({ error: 'El usuario y/o contraseña son incorrectos' });
            }
        });
    }
    crearUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const usuarioExiste = yield Usuario_1.default.find({ email: email.toLowerCase() });
            if (usuarioExiste.length > 0) {
                return res.status(200).json({ err: 'El email ingresado ya se encuentra registrado.' });
            }
            else {
                const nuevoUsuario = new Usuario_1.default(req.body);
                const usuarioRegistrado = yield nuevoUsuario.save();
                if (usuarioRegistrado) {
                    return res.status(200).json({ _id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre });
                }
                else {
                    return res.status(404).json({ err: 'No se pudo registrar.' });
                }
            }
        });
    }
    iniciarSesionCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const usuarioExiste = yield Cliente_1.default.find({ email: email, password: password });
            if (usuarioExiste.length > 0) {
                const data = JSON.stringify({ uid: usuarioExiste[0]._id });
                const token = jsonwebtoken_1.default.sign(data, keys_1.default.seckey);
                return res.status(200).json({ token });
            }
            else {
                return res.status(500).json({ error: 'El usuario y/o contraseña son incorrectos' });
            }
        });
    }
    crearUsuarioCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const usuarioExiste = yield Cliente_1.default.find({ email: email.toLowerCase() });
            if (usuarioExiste.length > 0) {
                return res.status(200).json({ err: 'El email ingresado ya se encuentra registrado.' });
            }
            else {
                const nuevoUsuario = new Cliente_1.default(req.body);
                const usuarioRegistrado = yield nuevoUsuario.save();
                if (usuarioRegistrado) {
                    return res.status(200).json({ _id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre });
                }
                else {
                    return res.status(404).json({ err: 'No se pudo registrar.' });
                }
            }
        });
    }
    getClienteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.data;
            const cliente = yield Cliente_1.default.findById(uid);
            if (cliente) {
                const _a = cliente._doc, { password } = _a, rest = __rest(_a, ["password"]);
                return res.status(200).json(rest);
            }
            else {
                return res.status(404).json({ ok: 'No se encontro el comercio' });
            }
        });
    }
    addFavorito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { comercioId } = req.body;
            let nuevosFavoritos = [];
            let respuesta = false;
            yield Cliente_1.default.findOne({ _id: id })
                .then((client) => {
                const existe = client.favoritos.filter((fav) => fav === comercioId);
                if (existe.length > 0) {
                    nuevosFavoritos = client.favoritos.filter((fav) => fav != comercioId);
                    respuesta = false;
                }
                else {
                    nuevosFavoritos = [...client.favoritos, comercioId];
                    respuesta = true;
                }
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se encontro el cliente' });
            });
            yield Cliente_1.default.updateOne({ _id: id }, { favoritos: nuevosFavoritos })
                .then((re) => {
                return res.status(200).json({ msg: respuesta });
            })
                .catch((err) => {
                return res.status(404).json({ msg: 'No se encontro el cliente' });
            });
        });
    }
    obtenerFavoritos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let favoritos = [];
            yield Cliente_1.default.findOne({ _id: id })
                .then((cliente) => {
                const favs = cliente.favoritos;
                if (favs.length > 0) {
                    favs.map((comercioId) => __awaiter(this, void 0, void 0, function* () {
                        yield Comercio_1.default.findOne({ _id: comercioId })
                            .then((res) => {
                            favoritos.push(res);
                        })
                            .catch((err) => {
                            return res.status(500).json({ msg: err });
                        });
                        if (favoritos.length >= favs.length) {
                            return res.status(200).json(favoritos);
                        }
                    }));
                }
                else {
                    return res.status(200).json([]);
                }
            })
                .catch((err) => {
                return res.status(500).json({ msg: err });
            });
        });
    }
}
exports.usersController = new UsersController();
