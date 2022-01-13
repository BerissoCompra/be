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
exports.pedidosController = void 0;
const Pedido_1 = __importDefault(require("../models/Pedido"));
class PedidosController {
    crearPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedido = new Pedido_1.default(req.body);
            const pedidoCreado = yield pedido.save();
            if (pedidoCreado) {
                return res.status(200).json({ _id: pedidoCreado._id });
            }
            else {
                return res.status(500).json({ err: 'El pedido no se pudo crear correctamente.' });
            }
        });
    }
    obtenerPedidosId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidos = yield Pedido_1.default.find({ _id: id });
            if (pedidos.length > 0) {
                return res.status(200).json(pedidos[0]);
            }
            else {
                return res.status(404).json({ ok: 'No se encontraron pedidos' });
            }
        });
    }
    obtenerPedidosCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidos = yield Pedido_1.default.find({ clienteId: id });
            if (pedidos) {
                return res.status(200).json(pedidos);
            }
            else {
                return res.status(404).json({ ok: 'No se encontraron pedidos' });
            }
        });
    }
    obtenerPedidosComercios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, estado } = req.params;
            const pedidos = yield Pedido_1.default.find({ comercioId: id, estado: estado });
            if (pedidos) {
                return res.status(200).json(pedidos);
            }
            else {
                return res.status(404).json({ ok: 'No se encontraron pedidos' });
            }
        });
    }
    actualizarPedido(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const pedidoActualizado = yield Pedido_1.default.updateOne({ _id: id }, req.body);
            if (pedidoActualizado) {
                return res.status(200).json({ ok: 'Pedido actualizado.' });
            }
            else {
                return res.status(500).json({ err: 'El pedido no se pudo crear correctamente.' });
            }
        });
    }
}
exports.pedidosController = new PedidosController();
