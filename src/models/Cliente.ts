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
    finalizoTutorial: {
        type: Boolean,
        default: false,
    },
    favoritos: []
        
}, {
    timestamps: true,
    versionKey: false,
})

export default model('cliente', ClienteSchema)