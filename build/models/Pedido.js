"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PedidoSchema = new mongoose_1.Schema({
    comercioId: {
        type: String,
        trim: true,
        required: true,
    },
    comercio: {},
    idPedido: {
        type: String,
    },
    clienteId: {
        type: String,
        trim: true,
        required: true,
    },
    productos: [],
    configuracion: {
        direccion: {
            type: String,
            trim: true,
            required: true,
        },
        numDep: {
            type: String,
            trim: true,
            required: true,
        },
        direccionInfo: {
            type: String,
            trim: true,
            required: true,
        },
        telefono: {
            type: String,
            trim: true,
            required: true,
        },
        pagaCon: {
            type: Number,
        },
        retira: {
            type: Boolean,
        },
        envio: {
            type: Boolean,
        },
        pagoEfectivo: {
            type: Boolean,
        },
        pagoDigital: {
            type: Boolean,
        },
    },
    estado: {
        type: Number,
    },
    total: {
        type: Number,
    },
    items: {
        type: Number,
    },
    motivoRechazo: {
        type: String,
    },
    codigoEntrega: {
        type: Number,
    },
    calificacion: {
        type: Number,
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('pedido', PedidoSchema);
