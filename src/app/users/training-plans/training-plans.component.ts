import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user.component';

@Component({
  selector: 'app-training-plans',
  standalone: true,
  imports: [CommonModule, SidebarUserComponent],
  templateUrl: './training-plans.component.html',
  styleUrls: ['./training-plans.component.css']
})
export class TrainingPlansComponent {
  plans = [
    {
      id: 1,
      name: 'Push Pull Legs (PPL)',
      description: 'Rutina dividida en 3 días: empuje, jalón y piernas. Ideal para principiantes e intermedios.',
      duration: '3-6 días por semana',
      difficulty: 'Intermedio',
      image: 'images/ppl.jpg',
      tips: [
        'Mantén un día de descanso entre cada sesión si entrenas 3 días',
        'Asegúrate de calentar adecuadamente cada grupo muscular',
        'Aumenta el peso gradualmente manteniendo la forma correcta'
      ],
      schedule: [
        {
          day: 'Día 1: Push (Pecho, Hombros, Tríceps)',
          exercises: [
            { name: 'Press de banca', sets: '4', reps: '8-10' },
            { name: 'Press inclinado con mancuernas', sets: '3', reps: '10-12' },
            { name: 'Press militar con barra', sets: '4', reps: '8-10' },
            { name: 'Elevaciones laterales', sets: '3', reps: '12-15' },
            { name: 'Fondos (paralelas)', sets: '3', reps: '10-12' },
            { name: 'Extensiones de tríceps con cuerda', sets: '3', reps: '12-15' }
          ]
        },
        // ... otros días similares
      ]
    },
    {
      id: 2,
      name: 'Arnold Split',
      description: 'Rutina de doble frecuencia semanal por grupo muscular, inspirada en Arnold Schwarzenegger.',
      duration: '6 días por semana',
      difficulty: 'Avanzado',
      image: 'images/arnold.jpg',
      tips: [
        'Esta rutina requiere una buena base de entrenamiento previo',
        'La recuperación y nutrición son fundamentales',
        'Ajusta los pesos según tu nivel de energía diario',
        'Mantén un registro de tus pesos y progresiones',
        'Incluye ejercicios de calentamiento específicos para cada grupo muscular'
      ],
      schedule: [
        {
          day: 'Día 1: Pecho/Espalda',
          exercises: [
            { name: 'Press de banca', sets: '4', reps: '8-10' },
            { name: 'Aperturas con mancuernas', sets: '3', reps: '12-15' },
            { name: 'Dominadas', sets: '4', reps: '8-12' },
            { name: 'Remo con barra', sets: '3', reps: '10-12' },
            { name: 'Pull-over', sets: '3', reps: '12-15' }
          ]
        },
        {
          day: 'Día 2: Hombros/Brazos',
          exercises: [
            { name: 'Press militar', sets: '4', reps: '8-10' },
            { name: 'Elevaciones laterales', sets: '3', reps: '12-15' },
            { name: 'Curl de bíceps con barra', sets: '3', reps: '10-12' },
            { name: 'Extensiones de tríceps', sets: '3', reps: '12-15' },
            { name: 'Encogimientos con barra', sets: '3', reps: '15-20' }
          ]
        },
        {
          day: 'Día 3: Piernas/Abdominales',
          exercises: [
            { name: 'Sentadilla', sets: '4', reps: '8-10' },
            { name: 'Prensa de piernas', sets: '3', reps: '10-12' },
            { name: 'Peso muerto rumano', sets: '3', reps: '12-15' },
            { name: 'Elevaciones de talones', sets: '3', reps: '15-20' },
            { name: 'Crunches en máquina', sets: '3', reps: '15-20' }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Torso Inferior para Mujeres',
      description: 'Rutina enfocada en el desarrollo y tonificación de glúteos y piernas, con trabajo complementario de torso.',
      duration: '4-5 días por semana',
      difficulty: 'Todos los niveles',
      image: 'images/torso-inferior.jpg',
      tips: [
        'Enfócate en la conexión mente-músculo',
        'Realiza ejercicios de activación de glúteos antes de cada sesión',
        'Mantén una progresión gradual en los pesos',
        'Prioriza la forma correcta sobre el peso',
        'Incluye ejercicios de estabilidad y core en tu calentamiento'
      ],
      schedule: [
        {
          day: 'Día 1: Glúteos/Piernas',
          exercises: [
            { name: 'Hip Thrust', sets: '4', reps: '10-12' },
            { name: 'Peso muerto sumo', sets: '4', reps: '8-10' },
            { name: 'Sentadilla goblet', sets: '3', reps: '12-15' },
            { name: 'Abducción con banda', sets: '3', reps: '15-20' },
            { name: 'Extensiones de cuádriceps', sets: '3', reps: '15' }
          ]
        },
        {
          day: 'Día 2: Espalda/Brazos',
          exercises: [
            { name: 'Jalón al pecho', sets: '4', reps: '10-12' },
            { name: 'Remo con mancuerna', sets: '4', reps: '10-12' },
            { name: 'Curl martillo', sets: '3', reps: '12-15' },
            { name: 'Extensiones de tríceps', sets: '3', reps: '12-15' },
            { name: 'Hiperextensiones', sets: '3', reps: '15' }
          ]
        },
        {
          day: 'Día 3: Piernas/Glúteos',
          exercises: [
            { name: 'Sentadilla profunda', sets: '4', reps: '10-12' },
            { name: 'Peso muerto rumano con mancuernas', sets: '4', reps: '10-12' },
            { name: 'Puentes de glúteos', sets: '3', reps: '12-15' },
            { name: 'Zancadas laterales', sets: '3', reps: '12-15' },
            { name: 'Elevaciones de talones', sets: '3', reps: '15-20' }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Heavy Duty',
      description: 'Rutina de alta intensidad y bajo volumen. Perfecta para optimizar tiempo y resultados.',
      duration: '2-3 días por semana',
      difficulty: 'Avanzado',
      image: '/images/heavyduty.jpg',
      tips: [
        'Cada serie debe llevarse al fallo muscular',
        'El descanso entre entrenamientos es crucial',
        'Mantén un diario de entrenamiento detallado',
        'Asegura una nutrición óptima para la recuperación',
        'Realiza un calentamiento completo antes de cada ejercicio'
      ],
      schedule: [
        {
          day: 'Día 1: Parte Superior',
          exercises: [
            { name: 'Press de banca', sets: '1', reps: '6-10' },
            { name: 'Pull-over', sets: '1', reps: '6-10' },
            { name: 'Dominadas lastradas', sets: '1', reps: '6-10' },
            { name: 'Remo con barra', sets: '1', reps: '6-10' },
            { name: 'Curl de bíceps', sets: '1', reps: '6-10' }
          ]
        },
        {
          day: 'Día 2: Piernas',
          exercises: [
            { name: 'Sentadilla', sets: '1', reps: '8-12' },
            { name: 'Peso muerto', sets: '1', reps: '6-10' },
            { name: 'Prensa de piernas', sets: '1', reps: '12-15' },
            { name: 'Extensiones de cuádriceps', sets: '1', reps: '12-15' },
            { name: 'Elevaciones de talones', sets: '1', reps: '15-20' }
          ]
        }
      ]
    }
  ];

  selectedPlan: any = null;

  showPlanDetails(plan: any) {
    this.selectedPlan = plan;
  }
}
