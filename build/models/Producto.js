"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductoSchema = new mongoose_1.Schema({
    comercioId: {
        type: String,
    },
    nombre: {
        type: String,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    imagen: {
        type: String,
        trim: true,
    },
    imagenPath: {
        type: String,
        trim: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    descuento: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: String,
        trim: true,
    },
    activo: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('producto', ProductoSchema);
