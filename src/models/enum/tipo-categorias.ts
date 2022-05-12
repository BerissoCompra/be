export enum TiposCategoriasEnum {
    GASTRONOMICOS = 'gastronomicos',
    EMPRENDEDORES = 'emprendedores',
    PROFESIONALES = 'profesionales',
    SERVICIOS = 'servicios',
    PRODUCTOS = 'productos',
}

export const tiposCategoria = [
  {descripcion: 'gastronomicos'},
  {descripcion: 'emprendedores'},
  {descripcion: 'servicios'},
  {descripcion: 'profesionales'},
  {descripcion: 'productos'},
]

export const montoPorCategoria = {
    gastronomicos: {
      monto: 0
    },
    emprendedores: {
      monto: 1300
    },
    profesionales: {
      monto: 1700
    },
    servicios: {
      monto: 1300
    },
  }