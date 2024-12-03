export interface Objetivo {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  progreso: number;
  completado: boolean;
  categoria: 'peso' | 'fuerza' | 'resistencia' | 'nutricion';
  userId: number;
} 