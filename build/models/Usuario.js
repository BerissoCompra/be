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
    tipo: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('usuario', UsuarioSchema);
