import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subjects } from 'src/app/core/models/announcement.model';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent {
  @Output() selectedSubjectsOutput = new EventEmitter<Subjects[]>();

  selectedSubjects: Subjects[] = [];
  subjects = Object.values(Subjects);
}
