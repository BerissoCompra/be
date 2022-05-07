import Categorias from "../models/Categorias"
import Cliente from "../models/Cliente"
import CodigosRecuperacion from "../models/CodigosRecuperacion"
import Comentarios from "../models/Comentarios"
import Comercio from "../models/Comercio"
import { RolesEnum } from "../models/enum/roles"
import Pedido from "../models/Pedido"
import Publicidad from "../models/Publicidad"
import Servicio from "../models/Servicio"
import Usuario from "../models/Usuario"
import bcrypt from "bcryptjs";

export const CLEARDB = async()=>{
    try {
        await Comercio.deleteMany({});
        await Usuario.deleteMany({});
        await Cliente.deleteMany({});
        await Pedido.deleteMany({});
        await Servicio.deleteMany({});
        await Categorias.deleteMany({});
        await Comentarios.deleteMany({});
        await CodigosRecuperacion.deleteMany({});
        await Publicidad.deleteMany({});

        console.log("BASE DE DATOS LIMPIA")
    } catch (error) {
        console.log(error); 
    }
}

export const InitialSetup = async()=>{
    createAdmin();
}

export const createAdmin = async () => {
    // check for an existing admin user
    const user = await Usuario.findOne({ email: "admin@administrador" });
  
    if (!user) {
      // create a new admin user
      const salt = await bcrypt.genSalt(10);
      await Usuario.create({
        nombre: "admin",
        apellido: 'administrador',
        email: "admin@administrador",
        password: await bcrypt.hash("admin", salt),
        rol: RolesEnum.ADMIN
      });

      console.log('Admin User Created!')
    }
};


