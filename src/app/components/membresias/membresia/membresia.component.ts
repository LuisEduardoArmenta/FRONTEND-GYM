import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-membresia',
  standalone: true,
  imports: [NavbarComponent, ],
  templateUrl: './membresia.component.html',
  styleUrl: './membresia.component.css'
})
export class MembresiaComponent {
  title: string = 'Gestión de Membresías';

}
