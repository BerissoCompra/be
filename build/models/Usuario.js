"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsuarioSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    nombreElegido: {
        type: String,
        trim: true,
        required: false,
    },
    apellido: {
        type: String,
        trim: true,
        required: true,
    },
    terminos: {
        type: Boolean,
        trim: true,
        required: true,
    },
    emailActivado: {
        default: false,
        type: Boolean,
        trim: true,
        required: true,
    },
    rol: {
        type: String,
        default: 'usuario',
        trim: true,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('usuario', UsuarioSchema);
