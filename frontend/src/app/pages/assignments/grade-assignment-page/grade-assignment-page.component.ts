import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Assignment } from '../../../core/models/assignment.model';
import { UserService } from '../../../core/services/user/user.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HttpParams } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentService } from '../../../core/services/assignment/assignment.service';
import { AssignmentDialogComponent } from '../../../shared/components/assignment/assignment-dialog/assignment-dialog.component';

@Component({
  selector: 'app-grade-assignment-page',
  templateUrl: './grade-assignment-page.component.html',
  styleUrl: './grade-assignment-page.component.scss',
})
export class GradeAssignmentPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'student',
    'title',
    'dueDate',
    'submittedAt',
    'grade',
    'action',
  ];

  public assignments: Assignment[] = [];
  public currentPage = 1;
  public assignmentsPerPage = 5;
  public totalAssignments: number = 0;
  public currentSortDirection = 'asc';
  public currentSortField = 'submittedAt';

  constructor(
    private assignmentService: AssignmentService,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadAssignments();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((pageEvent: PageEvent) => {
        this.currentPage = pageEvent.pageIndex + 1;
        this.assignmentsPerPage = pageEvent.pageSize;
        this.loadAssignments();
      });
    }

    if (this.sort) {
      this.sort.sortChange.subscribe((sortEvent: Sort) => {
        this.currentSortDirection = sortEvent.direction;
        this.currentSortField = sortEvent.active;
        this.loadAssignments();
      });
    }
  }

  public loadAssignments(): void {
    this.userService.getUser(this.authService.getUserId()).subscribe(
      (user) => {
        if (user.onModel === 'Professor') {
          const professorId = user.profile;

          const params = new HttpParams()
            .set('page', this.currentPage.toString())
            .set('limit', this.assignmentsPerPage.toString())
            .set('sortBy', this.currentSortField)
            .set('order', this.currentSortDirection)
            .set('professor', professorId);

          this.assignmentService.getAssignments(params).subscribe({
            next: ({ assignments, totalResults }) => {
              this.assignments = assignments;
              this.totalAssignments = totalResults;
            },
            error: (error) =>
              console.error('Error fetching assignments:', error),
          });
        } else {
          // Handle the case when the user is not a professor
          console.error('User is not a professor.');
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      },
    );
  }

  public openGradeDialog(assignment: Assignment): void {
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '800px',
      height: '800px',
      data: {
        assignment: assignment,
        isGrading: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadAssignments();
      }
    });
  }
}
