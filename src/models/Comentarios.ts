import {Schema, model} from 'mongoose';

const ComentarioSchema = new Schema({
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
})

export default model('comentario', ComentarioSchema)        