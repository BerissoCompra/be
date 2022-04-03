import {Schema, model} from 'mongoose';
import { TipoClientePublicidad } from './enum/tipo-publicidad.enum';

const PublicidadComercioSchema = new Schema({
    comercioId: {
        type: String,
        trim: true,
        required: false,
    },
    descripcion: {
        type: String,
        trim: true,
        required: false,
    },
    tipo:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    tipoPublicidad:{
        type: String,
        trim: true,
        required: true,
        default: TipoClientePublicidad.COMERCIO,
    },
    url:{
        type: String,
        trim: true,
        required: false,
    },
    imagenPath:{
        type: String,
        trim: true,
        required: false,
    },
    imagen:{
        type: String,
        trim: true,
        required: false,
    } 
}, {
    timestamps: true,
    versionKey: false,
})

export interface PublicidadInterface{
    comercioId: string;
    tipo: string;
    tipoPublicidad: string;
    url?: string
    imagen?: string;
}

export default model('publicidadComercio', PublicidadComercioSchema)