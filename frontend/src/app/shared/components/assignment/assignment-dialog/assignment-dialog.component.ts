import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Assignment } from '../../../../core/models/assignment.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AssignmentService } from '../../../../core/services/assignment/assignment.service';
import { Subject } from '../../../../core/models/subject.model';
import { Professor } from '../../../../core/models/professor.model';
import { ProfessorService } from '../../../../core/services/professor/professor.service';
import { SubjectService } from '../../../../core/services/subject/subject.service';
import { GroupService } from '../../../../core/services/group/group.service';
import { Group } from '../../../../core/models/group.model';

@Component({
  selector: 'app-assignment-dialog',
  templateUrl: './assignment-dialog.component.html',
  styleUrls: ['./assignment-dialog.component.scss'],
})
export class AssignmentDialogComponent implements OnInit {
  public isProfessor: boolean = false;
  public isEditMode: boolean = false;
  public tempAssignment!: Assignment;
  public isGrading: boolean = false;

  public subjects: Subject[] = [];
  public professors: Professor[] = [];
  public groups: Group[] = [];
  public selectedGroups: { [key: string]: boolean } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public isGrade: boolean,
    private dialogRef: MatDialogRef<AssignmentDialogComponent>,
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private snackBar: MatSnackBar,
    private professorService: ProfessorService,
    private subjectService: SubjectService,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    this.isProfessor = this.authService.hasRole('professor');
    this.isGrading = this.data.isGrading;
    this.tempAssignment = { ...this.data.assignment };

    this.subjectService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
    });
    this.professorService.getProfessors().subscribe((professors) => {
      this.professors = professors;
    });

    this.groupService.getGroups().subscribe((groups) => {
      this.groups = groups;
      groups.forEach((group) => {
        this.selectedGroups[group._id] =
          this.tempAssignment?.group?.some((g) => g._id === group._id) ?? false;
      });
    });
  }

  toggleEditMode() {
    if (!this.isEditMode) {
      this.tempAssignment = { ...this.data.assignment };
    }
    this.isEditMode = !this.isEditMode;
  }

  saveChanges() {
    if (this.validateAssignment(this.tempAssignment)) {
      this.tempAssignment.group = this.groups.filter(
        (group) => this.selectedGroups[group._id],
      );
      this.data.assignment = { ...this.tempAssignment };
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
      .deleteAssignment(this.data.assignment)
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

  numberOnly(event: KeyboardEvent): void {
    const pattern = /[0-9\.-]/;
    const inputChar = event.key;

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
