import { Component } from '@angular/core';
import { AssignmentService } from '../../../core/services/assignment/assignment.service';
import { catchError, finalize, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generate-assignments-page',
  templateUrl: './generate-assignments-page.component.html',
  styleUrl: './generate-assignments-page.component.scss',
})
export class GenerateAssignmentsPageComponent {
  max = 1000;
  min = 1;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 1;
  isLoading = false;
  constructor(
    private assignmentService: AssignmentService,
    private snackBar: MatSnackBar,
  ) {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }

  onGenerate() {
    this.isLoading = true;
    this.assignmentService
      .generateAssignments(this.value)
      .pipe(
        catchError((err) => {
          this.openSnackBar(
            'Erreur pendant la génération des assignments',
            'OK',
          );
          return throwError(err);
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe(() => {
        this.openSnackBar('Devoirs générés avec succès', 'OK');
      });
  }
}
