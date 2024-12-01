export interface Producto {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    estado: boolean;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
} 