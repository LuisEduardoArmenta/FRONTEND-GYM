export class MovimientoCaja {
    idMovimiento?: number;
    tipoMovimiento: string = '';
    concepto: string = '';
    monto: number = 0;
    fechaMovimiento?: Date;
    createdAt?: Date;
    caja?: any;

    constructor(data?: Partial<MovimientoCaja>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    isValid(): boolean {
        return this.monto > 0 && 
               this.concepto.trim() !== '' && 
               ['INGRESO', 'EGRESO'].includes(this.tipoMovimiento);
    }
} 