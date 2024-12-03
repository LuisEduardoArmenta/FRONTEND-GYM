export class Caja {
    idCaja?: number;
    montoInicial: number = 0;
    montoFinal?: number;
    fechaApertura?: Date;
    fechaCierre?: Date;
    estado?: string;
    observaciones?: string;
    movimientos: any[] = [];
    createdAt?: Date;
} 