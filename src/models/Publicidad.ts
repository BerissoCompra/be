import {Schema, model} from 'mongoose';

const PublicidadComercioSchema = new Schema({
    comercioId: {
        type: String,
        trim: true,
        required: true,
    },
    tipo:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    }
}, {
    timestamps: true,
    versionKey: false,
})

export interface PublicidadInterface{
    comercioId: string;
    tipo: string;
}

export default model('publicidadComercio', PublicidadComercioSchema)