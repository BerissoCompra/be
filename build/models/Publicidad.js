"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PublicidadComercioSchema = new mongoose_1.Schema({
    comercioId: {
        type: String,
        trim: true,
        required: true,
    },
    tipo: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.model('publicidadComercio', PublicidadComercioSchema);
