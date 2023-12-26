import { Component } from '@angular/core';
import { AssignmentService } from '../../../core/services/assignment/assignment.service';

@Component({
  selector: 'app-generate-assignments-page',
  templateUrl: './generate-assignments-page.component.html',
  styleUrl: './generate-assignments-page.component.scss',
})
export class GenerateAssignmentsPageComponent {
  constructor(private assignmentService: AssignmentService) {}

  onGenerate() {
    this.assignmentService
      .generateAssignments(100)
      .subscribe(() => console.log('Assignments generated successfully'));
  }
}
