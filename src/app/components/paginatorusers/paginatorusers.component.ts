import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'paginatorusers',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './paginatorusers.component.html',
  styleUrl: './paginatorusers.component.css'
})
export class PaginatorusersComponent {

  @Input() url: string = '';
  @Input() paginator: any = {};


}
