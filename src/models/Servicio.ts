import { Schema, model } from 'mongoose';
import { TiposCategoriasEnum } from './enum/tipo-categorias';

const ServicioSchema = new Schema(
  {
    usuarioId: {
      type: String,
      trim: true,
    },
    nombreResponsable: {
      type: String,
      trim: true,
    },
    nombreClasificado: {
      type: String,
      trim: true,
    },
    dias: [{
      type: String,
    }],
    tipo: {
      type: String,
      trim: true,
      default: TiposCategoriasEnum.SERVICIOS
    },
    horarios: [], 
    categoria: {
      type: String,
      trim: true,
    },
    activado: {
      type: Boolean,
      default: false,
    },
    prioridad: {
      type: String,
      default: 'Normal',
    },
    descripcion: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    monto: {
      type: String,
    },
    ubicacion: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      required: false, 
    },
    redes: {
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
      wsp: {
        type: String,
      },
    },
    imagen: {
      type: String,
      trim: true,
    },
    contacto: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('Servicio', ServicioSchema);
