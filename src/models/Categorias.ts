import { model, Schema } from "mongoose";

const CategoriaSchema = new Schema({
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    tipo: {
        type: String,
        trim: true,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
})


export default model('categoria', CategoriaSchema);