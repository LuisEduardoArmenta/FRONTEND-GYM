export interface Producto {
    id_producto?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    created_at?: Date;
} 