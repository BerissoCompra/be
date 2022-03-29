"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const comercioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    usuarioId: {
        type: String,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    direccion: {
        type: String,
        trim: true,
    },
    activado: {
        default: false,
        type: Boolean,
        trim: true,
        required: true,
    },
    telefono: {
        type: String,
        trim: true,
    },
    categoria: {
        type: String,
        trim: true,
    },
    dias: [{
            type: String,
        }],
    imagen: {
        type: String,
        trim: true,
    },
    imagenPath: {
        type: String,
        trim: true,
    },
    pagoDigital: {
        type: Boolean,
        default: false,
    },
    pagoEfectivo: {
        type: Boolean,
        default: true,
    },
    retiro: {
        type: Boolean,
        default: false,
    },
    tipoEnvio: {
        type: String,
        trim: true,
    },
    puntuacion: {
        default: 0,
        type: Number
    },
    contadorCalificaciones: {
        type: Number
    },
    estrellas: {
        type: Number
    },
    costoEnvio: {
        type: Number
    },
    horarios: {
        type: String,
        trim: true,
    },
    abierto: {
        type: Boolean,
        default: false,
    },
    cuenta: {
        alias: {
            type: String,
            trim: true,
        },
        cvu: {
            type: String,
            trim: true,
        },
        banco: {
            type: String,
            trim: true,
        },
        nombreApellido: {
            type: String,
            trim: true,
        },
    },
    estadisticas: {
        ventas: {
            type: Number,
            trim: true,
            default: 0
        },
        deuda: {
            type: Number,
            trim: true,
            default: 0
        },
        ingresosTotales: {
            type: Number,
            trim: true,
            default: 0
        },
        ultimoPago: {
            type: Date,
            trim: true,
        },
        proximoPago: {
            type: Date,
            trim: true,
        },
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('comercio', comercioSchema);
