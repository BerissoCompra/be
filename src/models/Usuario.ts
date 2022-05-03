import {Schema, model} from 'mongoose';
import bcrypt from "bcryptjs";

const UsuarioSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
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
    nombreElegido: {
        type: String,
        trim: true,
        required: false,
    },
    apellido: {
        type: String,
        trim: true,
        required: true,
    },
    terminos: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    emailActivado: {
        default: false,
        type: Boolean,
        trim: true,
        required: true,
    }, 
    rol: {
        type: String,
        default: 'nuevo',
        trim: true,
        required: true,
    },
        
}, {
    timestamps: true,
    versionKey: false,
})

UsuarioSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UsuarioSchema.statics.comparePassword = async (password, receivedPassword) => {
return await bcrypt.compare(password, receivedPassword)
}
  
export default model('Usuario', UsuarioSchema)