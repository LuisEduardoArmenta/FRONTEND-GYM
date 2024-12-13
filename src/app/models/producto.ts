export interface Producto {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
} 