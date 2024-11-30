export class Plan {
    idPlan?: number;
    nombre: string = '';
    descripcion: string = '';
    precio: number = 0;
    duracion: string = '';
    beneficios: string[] = [];
    createdAt?: Date;
    updatedAt?: Date;
}
