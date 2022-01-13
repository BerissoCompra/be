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
    tipo: {
        type: String,
        trim: true,
    
    },
        
}, {
    timestamps: true,
    versionKey: false,
})

export default model('usuario', UsuarioSchema)