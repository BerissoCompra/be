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
const CodigosRecuperacion_1 = __importDefault(require("../models/CodigosRecuperacion"));
const mailer_1 = require("../config/mailer");
class UsersController {
    iniciarSesion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const usuarioExiste = yield Usuario_1.default.find({ email: email, password: password });
            if (usuarioExiste.length > 0) {
                const activado = yield usuarioExiste[0].emailActivado;
                const data = JSON.stringify({ uid: usuarioExiste[0]._id });
                const token = jsonwebtoken_1.default.sign(data, keys_1.default.seckey);
                console.log(activado);
                return yield res.status(200).json({ token: token, activado });
            }
            else {
                return yield res.status(500).json({ error: 'El usuario y/o contraseña son incorrectos' });
            }
        });
    }
    crearUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const usuarioExiste = yield Usuario_1.default.find({ email: email.toLowerCase() });
            if (usuarioExiste.length > 0) {
                return res.status(200).json({ msg: 'El email ingresado ya se encuentra registrado.' });
            }
            else {
                const nuevoUsuario = new Usuario_1.default(req.body);
                const usuarioRegistrado = yield nuevoUsuario.save();
                if (usuarioRegistrado) {
                    const urlActivacion = `http://localhost:4200/accountverify/${usuarioRegistrado._id}`;
                    const html = `<h2>Aplicación ciudad | Haz click para activar:</h2><a href="${urlActivacion}">AQUI</a>`;
                    yield mailer_1.sendEmail('Activar Cuenta | Responsable de Comercio', email, 'Servicio de activación', html);
                    return res.status(200).json({ _id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre });
                }
                else {
                    return res.status(404).json({ msg: 'No se pudo registrar.' });
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
                return res.status(404).json({ error: 'El usuario y/o contraseña son incorrectos' });
            }
        });
    }
    VerificarCuenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const usuarioExiste = yield Usuario_1.default.findOne({ _id: id });
            if (usuarioExiste) {
                if (usuarioExiste.emailActivado === true) {
                    return res.status(404).json({ msg: 'Este usuario ya se encuentra activado.' });
                }
                else {
                    yield Usuario_1.default.updateOne({ _id: id }, { emailActivado: true })
                        .then(() => {
                        return res.status(200).json({ msg: 'Usuario Activado' });
                    })
                        .catch((msg) => {
                        return res.status(404).json({ msg });
                    });
                }
            }
            else {
                return res.status(404).json({ msg: 'No existe el usuario' });
            }
        });
    }
    crearUsuarioCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, terminos } = req.body;
            const usuarioExiste = yield Cliente_1.default.find({ email: email.toLowerCase() });
            if (usuarioExiste.length > 0) {
                return res.status(200).json({ msg: 'El email ingresado ya se encuentra registrado.' });
            }
            else if (!terminos) {
                return res.status(200).json({ msg: 'Debe aceptar los Términos y Condiciones.' });
            }
            else {
                const nuevoUsuario = new Cliente_1.default(req.body);
                const usuarioRegistrado = yield nuevoUsuario.save();
                if (usuarioRegistrado) {
                    return res.status(200).json({ _id: usuarioRegistrado._id, nombre: usuarioRegistrado.nombre });
                }
                else {
                    return res.status(404).json({ msg: 'No se pudo registrar.' });
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
            const cliente = yield Cliente_1.default.findOne({ _id: id });
            if (cliente) {
                const existe = cliente.favoritos.filter((fav) => fav === comercioId);
                if (existe.length > 0) {
                    nuevosFavoritos = cliente.favoritos.filter((fav) => fav != comercioId);
                    respuesta = false;
                }
                else {
                    nuevosFavoritos = [...cliente.favoritos, comercioId];
                    respuesta = true;
                }
                yield Cliente_1.default.updateOne({ _id: id }, { favoritos: nuevosFavoritos });
                return res.status(200).json({ msg: respuesta });
            }
            else {
                return res.status(404).json({ msg: 'No se encontro el cliente' });
            }
        });
    }
    obtenerFavoritos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cliente = yield Cliente_1.default.findOne({ _id: id });
            if (cliente) {
                const comerciosFavoritos = yield Promise.all(cliente.favoritos.map((comercioId) => __awaiter(this, void 0, void 0, function* () {
                    return yield Comercio_1.default.findOne({ _id: comercioId });
                })));
                return res.status(200).json(comerciosFavoritos);
            }
            else {
                return res.status(404).json({ msg: 'Id inexistente' });
            }
        });
    }
    EnviarCodigoVerificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const cliente = yield Usuario_1.default.findOne({ email });
            if (cliente) {
                const codigoRecuperacion = {
                    email,
                    codigo: `AC-${Math.round(Math.random() * 10000)}`
                };
                const html = `<h2>Aplicación ciudad | CODIGO:</h2><p>${codigoRecuperacion.codigo}</p>`;
                const crearCodigo = new CodigosRecuperacion_1.default(codigoRecuperacion);
                yield crearCodigo.save();
                yield mailer_1.sendEmail('Recuperación de contraseña', email, 'Servicio de recuperación', html);
                return res.status(200).send({ msg: true });
            }
            else {
                return res.status(404).json({ msg: 'El usuario no existe' });
            }
        });
    }
    verificarCodigo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, codigo } = req.body;
            const buscarCodigo = yield CodigosRecuperacion_1.default.findOne({ codigo, email }).catch((err) => res.status(500).json({ msg: err }));
            if (buscarCodigo) {
                return res.status(200).json({ msg: email });
            }
            else {
                return res.status(404).json({ msg: 'No se pudo registrar.' });
            }
        });
    }
    RecuperarPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo, password } = req.body;
            const codigoRecuperacion = yield CodigosRecuperacion_1.default.findOne({ codigo });
            if (codigoRecuperacion) {
                const usuario = yield Usuario_1.default.findOne({ email: codigoRecuperacion.email });
                if (usuario) {
                    yield Usuario_1.default.updateOne({ _id: usuario._id }, { password });
                    yield CodigosRecuperacion_1.default.deleteOne({ codigo, email: codigoRecuperacion.email });
                    return res.status(200).json({ msg: 'Contraseña actualizada.' });
                }
                else {
                    return res.status(404).json({ msg: 'Error.' });
                }
            }
            else {
                return res.status(404).json({ msg: 'Error.' });
            }
        });
    }
}
exports.usersController = new UsersController();
