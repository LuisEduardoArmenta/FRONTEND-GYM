import { Producto } from "./producto.interface";

export interface Venta {
    id_venta?: number;
    id_producto: number;
    cantidad: number;
    total: number;
    fecha_venta?: Date;
    vendedor: string;
    producto?: Producto;
} 