import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user.component';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nutricion',
  standalone: true,
  imports: [CommonModule, SidebarUserComponent, FormsModule],
  templateUrl: './nutricion.component.html',
  styleUrl: './nutricion.component.css'
})
export class NutricionComponent { 
  weight: number = 0;
  height: number = 0;
  age: number = 0;
  gender: string = 'masculino'; // Agregado para el género
  activityLevel: string = '';
  goal: string = '';
  recommendation: string = '';
  foodRecommendation: string = ''; // Recomendación alimenticia

  calculateRecommendation() {
    if (this.weight <= 0 || this.height <= 0 || this.age <= 0 || !this.activityLevel || !this.goal || !this.gender) {
      this.recommendation = 'Por favor, llena todos los campos con valores válidos.';
      return;
    }

    const tmb = this.calculateTMB(this.weight, this.height, this.age, this.gender);
    const calories = this.adjustCalories(tmb, this.activityLevel);

    switch (this.goal) {
      case 'pérdida de peso':
        this.recommendation = `Para perder peso, consume entre ${Math.floor(calories - 1000)} y ${Math.floor(calories - 500)} calorías al día.`;
        this.foodRecommendation = 'Alimentos recomendados: Verduras, frutas, proteínas magras, granos integrales.';
        break;
      case 'aumento de masa muscular':
        this.recommendation = `Para ganar masa muscular, consume entre ${Math.floor(calories + 250)} y ${Math.floor(calories + 500)} calorías al día.`;
        this.foodRecommendation = 'Alimentos recomendados: Pollo, pescado, huevos, quinoa, batidos de proteínas.';
        break;
      case 'mantenimiento':
        this.recommendation = `Para mantener tu peso, consume aproximadamente ${Math.floor(calories)} calorías al día.`;
        this.foodRecommendation = 'Alimentos recomendados: Comidas equilibradas con proteínas, carbohidratos y grasas saludables.';
        break;
    }
  }

  calculateTMB(weight: number, height: number, age: number, gender: string): number {
    if (gender === 'masculino') {
      return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age; // Hombres
    } else {
      return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age; // Mujeres
    }
  }

  adjustCalories(tmb: number, activityLevel: string): number {
    const factors: Record<string, number> = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      intenso: 1.725,
    };
    return tmb * (factors[activityLevel] || 1);
  }
}
