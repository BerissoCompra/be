"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CodRecuperacionSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    codigo: {
        type: String,
        trim: true,
        required: true,
    },
}, {
    timestamps: false,
    versionKey: false,
});
exports.default = mongoose_1.model('codigoRecuperacion', CodRecuperacionSchema);
