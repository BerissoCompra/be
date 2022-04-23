import {Schema, model} from 'mongoose';

const ProductoSchema = new Schema({
    comercioId: {
        type: String,
    },
    nombre: {
        type: String,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    imagen: {
        type: String,
        trim: true,
    },
    imagenPath: {
        type: String,
        trim: true,
    },
    precio: {
        type: Number,
        required: false,
    },
    descuento: {
        type: Number,
        default: 0,
    },
    categoria:{
        type: String,
        trim: true,
    },
    activo:{
        type: Boolean,
        default: true,
    }
    
}, {
    timestamps: true,
    versionKey: false,
})

export default model('producto', ProductoSchema)

