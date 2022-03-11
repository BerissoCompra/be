import {Schema, model} from 'mongoose';

const PedidoSchema = new Schema({
    comercioId: {
        type: String,
        trim: true,
        required: true,
    },
    clienteId: {
        type: String,
        trim: true,
        required: true,
    },
    nombreUsuario: {
        type: String,
        trim: true,
        required: true,
    },
    productos: [],
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
    estado: {
        type: Number,
    },
    total: {
        type: Number,
    },
    items: {
        type: Number,
    },
    pagaCon: {
        type: Number,
    },
    retira: {
        type: Boolean,
    },
    envio: {
        type: Boolean,
    },
    pagoEfectivo: {
        type: Boolean,
    },
    pagoDigital: {
        type: Boolean,
    },
    idPedido: {
        type: String,
    },
    motivoRechazo: {
        type: String,
    },
    codigoEntrega: {
        type: Number,
    },
    calificacion: {
        type: Number,
    }
}, {
    timestamps: true,
    versionKey: false,
})

export default model('pedido', PedidoSchema)