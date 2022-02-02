import {Schema, model} from 'mongoose';

const CodRecuperacionSchema = new Schema({
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
})

export default model('codigoRecuperacion', CodRecuperacionSchema)