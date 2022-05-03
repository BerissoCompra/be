import { Schema, model } from 'mongoose';

const ServicioSchema = new Schema(
  {
    nombre: {
      type: String,
      trim: true,
    },
    usuarioId: {
      type: String,
      trim: true,
    },
    categoría: {
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
