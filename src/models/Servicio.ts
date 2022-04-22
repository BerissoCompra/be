import { Schema, model } from 'mongoose';

const ServicioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      trim: true,
      required: true,
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
    imagenPath: {
      type: String,
      trim: true,
    },
    contacto: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('Servicio', ServicioSchema);
