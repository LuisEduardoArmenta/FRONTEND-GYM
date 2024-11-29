import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'paginatormembresias',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './paginatormembresias.component.html',
  styleUrl: './paginatormembresias.component.css'
})
export class PaginatormembresiasComponent {
  @Input() url: string = '';
  @Input() paginator: any = {};
}
