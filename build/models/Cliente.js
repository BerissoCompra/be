"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ClienteSchema = new mongoose_1.Schema({
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
    //-----------------------------------------------------------/
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
        required: false,
    },
    telefono: {
        type: String,
        trim: true,
        required: true,
    },
    genero: {
        type: String,
        trim: true,
        required: false,
    },
    favoritos: []
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('cliente', ClienteSchema);
