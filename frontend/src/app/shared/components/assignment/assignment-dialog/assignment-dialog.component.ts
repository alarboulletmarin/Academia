import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Assignment } from '../../../../core/models/assignment.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AssignmentService } from '../../../../core/services/assignment/assignment.service';

@Component({
  selector: 'app-assignment-dialog',
  templateUrl: './assignment-dialog.component.html',
  styleUrls: ['./assignment-dialog.component.css'],
})
export class AssignmentDialogComponent implements OnInit {
  public isProfessor: boolean = false;
  public isEditMode: boolean = false;
  public tempAssignment!: Assignment;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Assignment,
    private dialogRef: MatDialogRef<AssignmentDialogComponent>,
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isProfessor = this.authService.hasRole('professor');
  }

  toggleEditMode() {
    if (!this.isEditMode) {
      this.tempAssignment = { ...this.data };
    }
    this.isEditMode = !this.isEditMode;
  }

  saveChanges() {
    if (this.validateAssignment(this.tempAssignment)) {
      this.data = { ...this.tempAssignment };
      this.editAssignment();
      this.toggleEditMode();
    }
  }

  validateAssignment(assignment: Assignment): boolean {
    return !(!assignment.title.trim() || !assignment.description.trim());
  }

  editAssignment() {
    this.assignmentService
      .updateAssignment(this.tempAssignment)
      .pipe(
        catchError((err) => {
          this.showNotification(
            "Erreur lors de la mise à jour de l'assignment.",
          );
          return throwError(err);
        }),
      )
      .subscribe(() => {
        this.dialogRef.close('updated');
      });
  }

  deleteAssignment() {
    this.assignmentService
      .deleteAssignment(this.data)
      .pipe(
        catchError((err) => {
          this.showNotification(
            "Erreur lors de la suppression de l'assignment.",
          );
          return throwError(err);
        }),
      )
      .subscribe(() => {
        this.dialogRef.close('updated');
      });
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }
}
