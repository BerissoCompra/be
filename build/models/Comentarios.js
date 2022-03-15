"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ComentarioSchema = new mongoose_1.Schema({
    comercioId: {
        type: String,
        trim: true,
        required: true,
    },
    usuarioId: {
        type: String,
        trim: true,
        required: true,
    },
    comentario: {
        type: String,
        trim: true,
        required: false,
    },
    puntuacion: {
        type: String,
        trim: true,
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('comentario', ComentarioSchema);
