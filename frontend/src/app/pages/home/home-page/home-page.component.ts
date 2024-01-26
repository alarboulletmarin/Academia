import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AssignmentService } from '../../../core/services/assignment/assignment.service';
import { Assignment } from '../../../core/models/assignment.model';
import { HttpParams } from '@angular/common/http';
import { UserService } from '../../../core/services/user/user.service';
import { AssignmentDialogComponent } from '../../../shared/components/assignment/assignment-dialog/assignment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  protected assignmentsOfTheDay: Assignment[] = [];
  private allAssignments: Assignment[] = [];
  private totalAssignments!: number;

  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.redirectToLogin();
    }
    this.loadAssignmentsOfTheDay();
  }

  public loadAssignmentsOfTheDay(): void {
    const currentDate = new Date();

    this.userService.getUser(this.authService.getUserId()).subscribe(
      (user) => {
        if (user.onModel === 'Professor') {
          const professorId = user.profile;

          const params = new HttpParams()
            .set('dueDate', currentDate.toISOString())
            .set('professor', professorId)
            .set('paginate', 'false');

          this.assignmentService.getAssignments(params).subscribe({
            next: ({ assignments, totalResults }) => {
              this.assignmentsOfTheDay = assignments;
              this.totalAssignments = totalResults;
            },
            error: (error) =>
              console.error('Error fetching assignments:', error),
          });
        } else {
          const studentId = user.profile;

          const params = new HttpParams()
            .set('dueDate', currentDate.toISOString())
            .set('student', studentId)
            .set('paginate', 'false');

          this.assignmentService.getAssignments(params).subscribe({
            next: ({ assignments, totalResults }) => {
              this.assignmentsOfTheDay = assignments;
              this.totalAssignments = totalResults;
            },
            error: (error) =>
              console.error('Error fetching assignments:', error),
          });
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      },
    );
  }

  public openAssignmentDialog(assignment: Assignment): void {
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '800px',
      height: '850px',
      data: {
        assignment: assignment,
        isGrading: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadAssignmentsOfTheDay();
      }
    });
  }
}
