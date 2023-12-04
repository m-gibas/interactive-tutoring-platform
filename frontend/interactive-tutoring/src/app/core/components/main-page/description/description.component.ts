import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './description.component.html'
})
export class DescriptionComponent {}
