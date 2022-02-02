import {Schema, model} from 'mongoose';

const UsuarioSchema = new Schema({
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
        
}, {
    timestamps: true,
    versionKey: false,
})

export default model('usuario', UsuarioSchema)