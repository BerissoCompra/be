import {Schema, model} from 'mongoose';

const ClienteSchema = new Schema({
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
        required: true,
    },
    telefono: {
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

export default model('cliente', ClienteSchema)